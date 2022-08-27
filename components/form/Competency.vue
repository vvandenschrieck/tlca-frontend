<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
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
                :disabled="edit"
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
              />
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
                dense
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
          <competencies-select-learning-outcomes
            v-model="learningOutcomes"
            class="mb-3"
            :disabled="formBusy"
            vid="learningOutcomes"
          />
        </v-stepper-content>
      </v-stepper>

      <div class="text-right mt-5">
        <v-btn color="error" :disabled="formBusy" text @click="resetForm">
          {{ $t('general.reset') }}
        </v-btn>
        <v-btn color="primary" :loading="formBusy" text type="submit">
          {{ $t(`general.${action}`) }}
        </v-btn>
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'FormCompetency',
  components: { ValidationObserver },
  props: {
    competency: {
      type: Object,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: '',
      description: '',
      formBusy: false,
      formError: null,
      isPublic: false,
      learningOutcomes: [],
      name: '',
      partners: [],
      partnersList: [],
      tags: [],
      type: '',
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
    types() {
      return [
        { text: this.$t('competency.type.practical'), value: 'PRACTICAL' },
        { text: this.$t('competency.type.theoretical'), value: 'THEORETICAL' },
      ]
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const competency = this.competency

      this.code = competency?.code ?? ''
      this.description = competency?.description ?? ''
      this.isPublic = competency?.isPublic ?? false
      this.learningOutcomes = competency?.learningOutcomes ?? []
      this.name = competency?.name ?? ''
      this.partners = competency?.partners.map((p) => p.code) ?? []
      this.tags = competency?.tags ?? []
      this.type = competency?.type ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
    },
    async submit() {
      this.formBusy = true

      try {
        const data = {
          code: this.competency?.code ?? this.code,
          description: this.description,
          learningOutcomes: this.learningOutcomes,
          name: this.name,
          partners: this.partners,
          public: this.isPublic,
          tags: this.tags,
          type: this.type || undefined,
        }

        const mutation = require(`~/gql/manage/${this.action}Competency.gql`)
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Competency`])

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
  },
}
</script>
