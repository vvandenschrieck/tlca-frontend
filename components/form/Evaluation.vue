<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-card>
        <v-card-text>
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <learner-select-field
                v-model="learner"
                :course-code="courseCode"
                :disabled="edit"
                @change="onSelectLearner"
              />
            </v-col>

            <v-col cols="12" md="6">
              <assessment-select-field
                v-model="assessment"
                :course-code="courseCode"
                :disabled="edit"
                @change="onSelectAssessment"
              />
            </v-col>
          </v-row>

          <assessment-instance-selector
            v-if="showInstanceSelector"
            v-model="instance"
            :assessment-id="assessment"
            :course-code="courseCode"
            :edit="edit"
            :learner="learner"
            @change="updateForm"
          >
            <template #body="{ hasUnpublishedEvaluations, selected }">
              <v-alert
                v-if="hasUnpublishedEvaluations"
                class="mx-4"
                dense
                outlined
                type="warning"
              >
                There are unpublished evaluations for this instance
              </v-alert>

              <h4>{{ $t('general.information.general') }}</h4>

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
                    :label="$t('evaluation.comment._')"
                  />
                </v-col>
              </v-row>

              <h4>{{ $t('evaluation.competencies._') }}</h4>

              <assessment-competencies-list
                v-if="assessment"
                v-model="selectedCompetencies"
                :assessment-id="assessment"
                :course-code="courseCode"
                :edit="edit"
                form
                hide-checklist
                :selected="initialCompetencies ?? selected"
              />

              <h4>{{ $t('general.information.private') }}</h4>

              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="note"
                    auto-grow
                    clear-icon="mdi-close-circle"
                    clearable
                    filled
                    :label="$t('evaluation.note._')"
                  />
                </v-col>
              </v-row>
            </template>
          </assessment-instance-selector>
        </v-card-text>
      </v-card>

      <div v-if="showActions || edit" class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn :action="action" :loading="formBusy" />
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import datetime from '@/mixins/datetime.js'

export default {
  name: 'FormEvaluation',
  components: { ValidationObserver },
  mixins: [datetime],
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
      instance: null,
      formBusy: false,
      formError: null,
      initialCompetencies: null,
      learner: null,
      note: '',
      selectedCompetencies: [],
      showActions: false,
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
    showInstanceSelector() {
      return this.assessment && this.learner
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    onSelectAssessment() {
      this.instance = null
      this.$emit('assessmentSelected', this.assessment)
    },
    onSelectLearner() {
      this.instance = null
    },
    reset() {
      const evaluation = this.evaluation

      const evalDate =
        evaluation && evaluation.created !== evaluation.date
          ? evaluation.date
          : undefined

      this.assessment = evaluation?.assessment?.id ?? null
      this.comment = evaluation?.comment ?? ''
      this.evalDate = evalDate ?? ''
      this.initialCompetencies =
        evaluation?.competencies?.map((c) => ({
          checklist: c.checklist,
          competency: c.competency.code,
          learningOutcomes: c.learningOutcomes,
          selected: c.selected,
        })) ?? null
      this.instance = evaluation?.instance?.id ?? null
      this.learner = evaluation?.learner?.username ?? null
      this.note = evaluation?.note ?? ''
      this.selectedCompetencies = []
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const data = {
        comment: this.comment,
        competencies: this.selectedCompetencies
          .filter((c) => !c.disabled)
          .map((c) => ({
            checklist: {
              ...c.checklist,
              __typename: undefined,
            },
            competency: c.competency,
            learningOutcomes: c.learningOutcomes?.map(
              (lo) => lo.selected && !lo.disabled
            ),
            selected: c.selected,
          })),
        evalDate: this.evalDate,
        note: this.note,
      }

      if (this.edit) {
        data.id = this.evaluation.id
      } else {
        data.assessment = this.assessment
        data.instance = this.instance
        data.learner = this.learner
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
          // this.reset()
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
    updateForm(canAddEvaluation) {
      this.showActions = canAddEvaluation
    },
  },
}
</script>
