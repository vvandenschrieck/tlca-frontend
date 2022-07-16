<template>
  <div>
    <h2 v-t="'competency.create'"></h2>

    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <v-form :disabled="formBusy" @submit.prevent="handleSubmit(create)">
        <v-alert
          v-if="error"
          v-t="error"
          type="error"
          outlined
          dense
          class="mt-5"
        ></v-alert>

        <v-stepper non-linear vertical>
          <v-stepper-step editable step="1">{{
            $t('general.information.general')
          }}</v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field-with-validation
                  v-model="code"
                  vid="code"
                  required
                  rules="required|alpha_dash"
                  :label="$t('competency.code')"
                >
                </v-text-field-with-validation>
              </v-col>

              <v-col cols="12" md="7">
                <v-text-field-with-validation
                  v-model="name"
                  required
                  rules="required"
                  :label="$t('competency.name')"
                >
                </v-text-field-with-validation>
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="type"
                  :items="types"
                  :label="$t('competency.type._')"
                  clearable
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  :label="$t('competency.description')"
                  filled
                  auto-grow
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-textarea-with-validation>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="2">{{
            $t('general.information.additional')
          }}</v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="partners"
                  :items="partnersList"
                  :label="$t('competency.partners')"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-switch
                  v-model="isPublic"
                  :label="$t('competency.visibility.public')"
                ></v-switch>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="3">{{
            $t('competency.learning_outcomes._')
          }}</v-stepper-step>

          <v-stepper-content step="3">
            <v-alert type="info" dense outlined>Upcoming feature</v-alert>
          </v-stepper-content>
        </v-stepper>
        <div class="text-right mt-5">
          <v-btn
            v-t="'general.reset'"
            :disabled="formBusy"
            color="error"
            text
            @click="reset()"
          ></v-btn>
          <v-btn
            v-t="'general.create'"
            type="submit"
            :loading="formBusy"
            color="primary"
            text
          ></v-btn>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import createCompetency from '~/gql/manage/createCompetency.gql'

export default {
  name: 'ManageCreateCompetencyPage',
  components: { ValidationObserver },
  data() {
    return {
      code: '',
      description: '',
      error: null,
      formBusy: false,
      name: '',
      partners: [],
      partnersList: [],
      isPublic: false,
      type: '',
    }
  },
  computed: {
    types() {
      return [
        { text: this.$t('competency.type.practical'), value: 'PRACTICAL' },
        { text: this.$t('competency.type.theoretical'), value: 'THEORETICAL' },
      ]
    },
  },
  methods: {
    reset() {
      this.code = ''
      this.description = ''
      this.error = null
      this.name = ''
      this.partners = []
      this.isPublic = false
      this.type = ''
    },
    async create() {
      this.formBusy = true

      try {
        const data = {
          code: this.code,
          description: this.description,
          name: this.name,
          partners: this.partners,
          isPublic: this.isPublic,
          type: this.type || undefined,
        }

        const response = await this.$apollo
          .mutate({
            mutation: createCompetency,
            variables: data,
          })
          .then(({ data }) => data && data.createCompetency)

        if (response) {
          const code = this.code
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.COMPETENCY_CREATED')
          )
          this.$router.push({
            name: 'manage-competencies-code',
            params: { code },
          })
          return
        } else {
          this.error = 'error._'
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          const gqlError = err.graphQLErrors[0]
          if (gqlError.extensions?.formErrors) {
            this.$refs.form.setErrors(gqlError.extensions.formErrors)
          } else {
            this.error = `error.${gqlError.message}`
          }
        } else {
          this.error = 'error._'
        }
      }
      this.formBusy = false
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
