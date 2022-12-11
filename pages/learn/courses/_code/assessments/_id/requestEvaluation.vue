<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getAssessment.gql')"
    :variables="{ courseCode, assessmentId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
            <v-card>
              <v-card-text class="text--primary">
                <v-alert v-if="formError" dense outlined type="error">
                  {{ $t(formError) }}
                </v-alert>

                <p>{{ $t('evaluation.request.instructions') }}</p>

                <assessment-instance-selector
                  v-model="config"
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
                  @change="updateForm"
                >
                  <template #body="{ selected }">
                    <h4>{{ $t('evaluation.competencies._') }}</h4>

                    <assessment-competencies-list
                      v-model="selectedCompetencies"
                      :assessment-id="assessmentId"
                      :course-code="courseCode"
                      form
                      :phase="config?.phase"
                      :selected="selected"
                      student-view
                    />

                    <h4>{{ $t('evaluation.comment._') }}</h4>

                    <v-row>
                      <v-col cols="12" md="12">
                        <v-textarea
                          v-model="explanation"
                          auto-grow
                          clear-icon="mdi-close-circle"
                          clearable
                          filled
                          hide-details
                          :label="$t('evaluation.comment._')"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </assessment-instance-selector>
              </v-card-text>
            </v-card>

            <div v-if="showActions" class="text-right mt-5">
              <submit-btn action="ask" :loading="formBusy" />
            </div>
          </v-form>
        </ValidationObserver>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <assessment-info-panel :assessment-id="assessmentId" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import errors from '@/mixins/errors.js'
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseAssessmentRequestEvaluationPage',
  components: { ValidationObserver },
  mixins: [errors, titles],
  data() {
    return {
      assessment: null,
      config: null,
      course: null,
      explanation: '',
      formBusy: false,
      formError: null,
      selectedCompetencies: [],
      showActions: false,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
    }
  },
  computed: {
    assessmentId() {
      return this.$route.params.id
    },
    canShowContent() {
      return (
        (!this.course && !this.assessment) ||
        (this.course.isRegistered && this.assessment.canRequestEvaluation)
      )
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.assessment
      this.course = data.course
      this.title = data.assessment?.name ?? ''
    },
    async submit() {
      this.formBusy = true

      // Prepare the list of selected competencies.
      const selectedCompetencies = this.selectedCompetencies
        .filter((c) => !c.disabled)
        .map((c) => ({
          checklist: c.checklist,
          competency: c.competency,
          learningOutcomes: c.learningOutcomes?.map(
            (lo) => lo.selected && !lo.disabled
          ),
          selected: c.selected,
        }))

      // Build the data to send to the mutation.
      const data = {
        assessment: this.assessmentId,
        competencies: selectedCompetencies,
        explanation: this.explanation,
        instance: this.config?.instance,
        phase: this.config?.phase,
      }
      const mutation = require(`~/gql/learn/requestEvaluation.gql`)

      // Call the mutation.
      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data.requestEvaluation)

        if (response) {
          const id = response.id

          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_REQUEST')
          )
          this.$router.push({
            name: 'learn-courses-code-evaluations-id',
            params: { code: this.courseCode, id },
          })
          return
        }
      } catch (err) {
        this.formError = this.handleError(err, this.$refs.form)
      }

      this.formBusy = false
    },
    updateForm(canAddEvaluation) {
      this.showActions = canAddEvaluation
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
