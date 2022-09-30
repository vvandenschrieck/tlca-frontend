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

          <v-row v-if="showInstanceConfiguration">
            <v-col cols="12" md="4">
              <v-switch
                v-model="newInstance"
                class="ml-2"
                dense
                :disabled="instance !== null"
                :label="$t('assessment.instance.new')"
                @change="switchNewInstance"
              />
            </v-col>

            <v-col cols="12" md="5">
              <v-select
                v-model="instance"
                clearable
                :disabled="newInstance || !assessmentInstances?.length"
                :items="assessmentInstances"
                item-value="i"
                :label="$tc('assessment.instance._', 1)"
                @change="selectInstance"
              >
                <template #item="{ item }">
                  {{
                    $t('assessment.instance.instance_name', { nb: item.i + 1 })
                  }}
                  ({{ formatDateTimeCompact(item.datetime) }})
                </template>

                <template #selection="{ item }">
                  {{
                    $t('assessment.instance.instance_name', { nb: item.i + 1 })
                  }}
                  <small
                    >&nbsp;({{ formatDateTimeCompact(item.datetime) }})</small
                  >
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" md="3">
              <span
                v-if="
                  newInstance ||
                  (instance !== null && assessmentInfo.isIncremental)
                "
              >
                {{ $t('general.limit') }}
              </span>

              <v-progress-linear
                v-if="newInstance"
                height="20"
                :value="
                  (assessmentInstances.length * 100) /
                  (assessmentInfo.instances ?? assessmentInstances.length + 1)
                "
              >
                <span class="font-weight-black text-caption">
                  {{ assessmentInstances.length }} /
                  {{ assessmentInfo.instances ?? $t('general.infinity') }}
                </span>
              </v-progress-linear>

              <v-progress-linear
                v-if="instance !== null && assessmentInfo.isIncremental"
                height="20"
                :value="
                  (evaluations.filter(
                    (e) => e.instance.id === assessmentInstances[instance].id
                  ).length *
                    100) /
                  (assessmentInfo.takes ??
                    evaluations.filter(
                      (e) => e.instance.id === assessmentInstances[instance].id
                    ).length + 1)
                "
              >
                <span class="font-weight-black text-caption">
                  {{
                    evaluations.filter(
                      (e) => e.instance.id === assessmentInstances[instance].id
                    ).length
                  }}
                  /
                  {{ assessmentInfo.takes ?? $t('general.infinity') }}
                </span>
              </v-progress-linear>
            </v-col>
          </v-row>

          <v-progress-linear v-if="formLoading" :indeterminate="true" />

          <v-alert
            v-if="
              canAddEvaluation &&
              assessmentInstances &&
              evaluations?.filter(
                (e) =>
                  !e.isPublished &&
                  e.instance.id === assessmentInstances[instance]?.id
              ).length
            "
            class="mx-4"
            dense
            outlined
            type="warning"
          >
            Il y a des évaluations non publiées pour cette instance
          </v-alert>

          <div v-if="showAllForm && canAddEvaluation">
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

            <evaluation-assessment-competencies-form
              v-if="assessment"
              v-model="selectedCompetencies"
              :assessment-id="assessment"
              :course-code="courseCode"
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
          </div>

          <v-alert
            v-if="showAllForm && !canAddEvaluation"
            class="mx-4 mt-5"
            dense
            outlined
            type="info"
          >
            Cannot add evaluation
          </v-alert>
        </v-card-text>
      </v-card>

      <div v-if="canAddEvaluation" class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn :action="action" :loading="formBusy" />
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import getLearnerEvaluations from '~/gql/teach/getLearnerEvaluations.gql'
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
      assessmentInfo: null,
      assessmentInstances: null,
      comment: '',
      evalDate: '',
      evaluations: null,
      instance: null,
      formBusy: false,
      formError: null,
      formLoading: false,
      learner: null,
      newInstance: false,
      note: '',
      selectedCompetencies: [],
      showInstanceConfiguration: false,
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
    canAddEvaluation() {
      const assessment = this.assessmentInfo
      const instances = this.assessmentInstances

      if (!this.showAllForm || !(assessment && instances)) {
        return false
      }

      // It is not possible to create a new instance if the limit has been reached.
      const maxInstances = assessment.instances
      const nbInstances = instances.length
      if (this.newInstance && maxInstances && nbInstances >= maxInstances) {
        return false
      }

      // It is not possible to add an evaluation if it is not an incremental
      // or if the limit of takes has been reached
      // or if all the competencies have already been acquired.
      if (this.instance !== null) {
        const instance = instances[this.instance]

        if (!assessment.isIncremental) {
          return false
        } else {
          const evaluations = this.evaluations.filter(
            (e) => e.instance.id === instance.id
          )

          if (assessment.takes && evaluations.length >= assessment.takes) {
            return false
          }
        }

        // Check what has been acquired by all the previous published evaluations
        const evaluations = this.evaluations.filter(
          (e) => e.isPublished && e.instance.id === instance.id
        )
        const mandatoryCompetencies = {}
        const allCompetencies = {}
        assessment.competencies.forEach(({ competency, isOptional }) => {
          allCompetencies[competency.code] = {
            selected: false,
            learningOutcomes: [],
          }
          if (!isOptional) {
            mandatoryCompetencies[competency.code] = false
          }
        })
        evaluations.forEach((e) => {
          e.competencies.forEach(
            ({ competency, learningOutcomes, selected }) => {
              allCompetencies[competency.code].selected ||= selected
              learningOutcomes.forEach((lo, i) => {
                allCompetencies[competency.code].learningOutcomes[i] ||= lo
              })
              if (competency.code in mandatoryCompetencies) {
                mandatoryCompetencies[competency.code] ||= selected
              }
            }
          )
        })

        if (
          Object.keys(mandatoryCompetencies).every(
            (c) => mandatoryCompetencies[c]
          )
        ) {
          return false
        }

        Object.keys(allCompetencies).forEach((code) => {
          if (allCompetencies[code].learningOutcomes?.length) {
            const sc = this.selectedCompetencies.find(
              (c) => c.competency === code
            )
            if (sc) {
              allCompetencies[code].learningOutcomes.forEach((lo, i) => {
                if (lo) {
                  sc.learningOutcomes[i].disabled = true
                  sc.learningOutcomes[i].selected = true
                }
              })
            }
          }

          if (allCompetencies[code].selected) {
            const sc = this.selectedCompetencies.find(
              (c) => c.competency === code
            )
            if (sc) {
              sc.disabled = true
              sc.selected = true
            }
          }
        })
      }

      return true
    },
    showAllForm() {
      return this.newInstance || this.instance !== null
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    selectInstance(value) {
      if (value) {
        this.newInstance = false
      }
    },
    switchNewInstance(value) {
      if (value) {
        this.instance = null
      }
    },
    reset() {
      const evaluation = this.evaluation

      // this.assessment = null
      this.comment = evaluation?.comment ?? ''
      this.evalDate = evaluation?.evalDate ?? ''
      // this.learner = null
      this.newInstance = false
      this.note = evaluation?.note ?? ''
      this.selectedCompetencies = []
      // this.showInstanceConfiguration = false
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
        competencies: this.selectedCompetencies
          .filter((c) => !c.disabled)
          .map((c) => ({
            checklist: c.checklist,
            competency: c.competency,
            learningOutcomes: c.learningOutcomes.map(
              (lo) => lo.selected && !lo.disabled
            ),
            selected: c.selected,
          })),
        evalDate: this.evalDate,
        instance:
          this.instance !== null
            ? this.assessmentInstances[this.instance].id
            : null,
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
    async updateForm() {
      this.showInstanceConfiguration = false

      // Emit events when either assessment or learner have been selected.
      if (this.assessment) {
        this.$emit('assessmentSelected', this.assessment)
      }

      // Show the complete evaluation form if both assessment and learner have been selected.
      if (this.assessment && this.learner) {
        this.formLoading = true
        const { assessment, assessmentInstances, evaluations } =
          await this.$apollo
            .query({
              fetchPolicy: 'no-cache',
              query: getLearnerEvaluations,
              variables: {
                assessment: this.assessment,
                courseCode: this.$route.params.code,
                learner: this.learner,
              },
            })
            .then(({ data }) => data)

        this.assessmentInfo = assessment
        this.assessmentInstances = assessmentInstances
          .sort((a, b) => (a.datetime > b.datetime ? 1 : -1))
          .map((ai, i) => ({ ...ai, i }))
        this.evaluations = evaluations

        this.formLoading = false
        this.showInstanceConfiguration = true
      }
    },
  },
}
</script>
