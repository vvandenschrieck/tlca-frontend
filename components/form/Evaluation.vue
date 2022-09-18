<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <v-card-text class="mt-5 pb-0">
          <v-row>
            <v-col cols="12" md="6">
              <learner-select-field
                v-model="learner"
                :course-code="courseCode"
                :disabled="formLoading"
                @change="updateForm"
              />
            </v-col>

            <v-col cols="12" md="6">
              <assessment-select-field
                v-model="assessment"
                :course-code="courseCode"
                :disabled="formLoading"
                @change="updateForm"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-progress-linear v-if="formLoading" :indeterminate="true" />

        <div v-if="showAllForm">
          <stepper-step step="1" :title="$t('general.information.general')">
            <v-row>
              <v-col cols="12" md="6">
                <date-time-picker-with-validation
                  v-model="evalDate"
                  :label="$t('evaluation.date')"
                  vid="evalDate"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="comment"
                  auto-grow
                  clear-icon="mdi-close-circle"
                  clearable
                  filled
                  :label="$t('evaluation.comment')"
                />
              </v-col>
            </v-row>
          </stepper-step>

          <stepper-step step="2" :title="$t('evaluation.competencies._')">
            <evaluation-assessment-competencies-form
              v-if="assessment"
              v-model="selectedCompetencies"
              :assessment-id="assessment"
              :course-code="courseCode"
            />
          </stepper-step>

          <stepper-step step="3" :title="$t('general.information.private')">
            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="note"
                  auto-grow
                  clear-icon="mdi-close-circle"
                  clearable
                  filled
                  :label="$t('evaluation.note')"
                />
              </v-col>
            </v-row>
          </stepper-step>
        </div>
      </v-stepper>

      <div v-if="showAllForm" class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn :action="action" :loading="formBusy" />
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import getLearnerEvaluations from '~/gql/teach/getLearnerEvaluations.gql'

export default {
  name: 'FormEvaluation',
  components: { ValidationObserver },
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    evaluation: {
      type: Object,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      assessment: null,
      comment: '',
      evalDate: '',
      formBusy: false,
      formError: null,
      formLoading: false,
      learner: null,
      note: '',
      selectedCompetencies: [],
      showAllForm: false,
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const evaluation = this.evaluation

      // this.assessment = null
      this.comment = evaluation?.comment ?? ''
      this.evalDate = evaluation?.evalDate ?? ''
      // this.learner = null
      this.note = evaluation?.note ?? ''
      this.selectedCompetencies = []
      // this.showAllForm = false
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const data = {
        assessment: this.assessment,
        comment: this.comment,
        competencies: this.selectedCompetencies,
        evalDate: this.evalDate,
        learner: this.learner,
        note: this.note,
      }
      const mutation = require(`~/gql/teach/${this.action}Evaluation.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Evaluation`])

        if (response) {
          const id = response.id
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_CREATE')
          )
          this.$router.push({
            name: 'teach-courses-code-evaluations-id',
            params: { code: this.courseCode, id },
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
    async updateForm() {
      this.showAllForm = false

      // Emit events when either assessment or learner have been selected.
      if (this.assessment) {
        this.$emit('assessmentSelected', this.assessment)
      }

      // Show the complete evaluation form if both assessment and learner have been selected.
      if (this.assessment && this.learner) {
        this.formLoading = true
        const evaluations = await this.$apollo
          .query({
            query: getLearnerEvaluations,
            variables: {
              assessment: this.assessment,
              courseCode: this.$route.params.code,
              learner: this.learner,
            },
          })
          .then(({ data }) => data.evaluations)

        this.formLoading = false
        this.showAllForm = true
        console.log(evaluations)
      }
    },
  },
}
</script>
