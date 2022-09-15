<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <stepper-step step="1" :title="$t('general.information.general')">
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
                vid="name"
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
                vid="description"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="2" :title="$t('general.information.additional')">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="type"
                clearable
                :items="types"
                :label="$t('competency.type._')"
                vid="type"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-switch
                v-model="isPublic"
                :label="$t('competency.visibility.public')"
                vid="isPublic"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <partner-select-field v-model="partners" vid="partners" />
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
                vid="tags"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="3" :title="$t('competency.learning_outcomes._')">
          <select-competencies-learning-outcomes
            v-model="learningOutcomes"
            class="mb-3"
            :disabled="formBusy"
            vid="learningOutcomes"
          />
        </stepper-step>
      </v-stepper>

      <div class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn :action="action" :loading="formBusy" />
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
      return ['PRACTICAL', 'THEORETICAL'].map((value) => ({
        text: this.$t(`competency.type.${value.toLowerCase()}`),
        value,
      }))
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
      this.learningOutcomes =
        competency?.learningOutcomes?.map((lo) => ({
          ...lo,
          __typename: undefined,
        })) ?? []
      this.name = competency?.name ?? ''
      this.partners = competency?.partners.map((p) => p.code) ?? []
      this.tags = competency?.tags ?? []
      this.type = competency?.type ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const learningOutcomes = this.learningOutcomes.map((lo) => ({
        ...lo,
        takes: parseInt(lo.takes, 10),
      }))
      const data = {
        code: this.competency?.code ?? this.code,
        description: this.description,
        learningOutcomes,
        name: this.name,
        partners: this.partners,
        public: this.isPublic,
        tags: this.tags,
        type: this.type || undefined,
      }
      const mutation = require(`~/gql/manage/${this.action}Competency.gql`)

      try {
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
