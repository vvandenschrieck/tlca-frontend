<template>
  <div>
    <h2>{{ $t('competency.create') }}</h2>

    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <v-form :disabled="formBusy" @submit.prevent="handleSubmit(create)">
        <v-alert v-if="formError" class="mt-5" dense outlined type="error">
          {{ $t(formError) }}
        </v-alert>

        <v-stepper non-linear vertical>
          <v-stepper-step editable step="1">
            {{ $t('general.information.general') }}
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field-with-validation
                  v-model="code"
                  :label="$t('competency.code')"
                  required
                  rules="required|alpha_dash"
                  vid="code"
                />
              </v-col>

              <v-col cols="12" md="10">
                <v-text-field-with-validation
                  v-model="name"
                  :label="$t('competency.name')"
                  required
                  rules="required"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  auto-grow
                  clear-icon="mdi-close-circle"
                  clearable
                  filled
                  :label="$t('competency.description')"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="2">
            {{ $t('general.information.additional') }}
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="type"
                  clearable
                  :items="types"
                  :label="$t('competency.type._')"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-switch
                  v-model="isPublic"
                  :label="$t('competency.visibility.public')"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <partner-select-field v-model="partners" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox
                  v-model="tags"
                  append-icon=""
                  chips
                  clearable
                  deletable-chips
                  :label="$tc('competency.tags', 2)"
                  multiple
                  small-chips
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="3">
            {{ $t('competency.learning_outcomes._') }}
          </v-stepper-step>

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
          />
          <v-btn
            v-t="'general.create'"
            type="submit"
            :loading="formBusy"
            color="primary"
            text
          />
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
      formBusy: false,
      formError: null,
      name: '',
      partners: [],
      partnersList: [],
      isPublic: false,
      tags: [],
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
    async create() {
      this.formBusy = true

      try {
        const data = {
          code: this.code,
          description: this.description,
          name: this.name,
          partners: this.partners,
          public: this.isPublic,
          tags: this.tags,
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
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          const gqlError = err.graphQLErrors[0]
          if (gqlError.extensions?.formErrors) {
            this.$refs.form.setErrors(gqlError.extensions.formErrors)
          } else {
            this.formError = `error.${gqlError.message}`
          }
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
      this.formBusy = false
    },
    reset() {
      this.code = ''
      this.description = ''
      this.formError = null
      this.name = ''
      this.partners = []
      this.isPublic = false
      this.tags = []
      this.type = ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
