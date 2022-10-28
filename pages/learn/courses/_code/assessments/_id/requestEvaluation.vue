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
            <v-alert v-if="formError" class="mt-5" dense outlined type="error">
              {{ $t(formError) }}
            </v-alert>

            <v-card>
              <v-card-text class="text--primary">
                <h4>{{ $tc('assessment.instance._', 1) }}</h4>

                <assessment-instance-selector
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
                  @change="updateForm"
                >
                  <template #body="{ selected }">
                    <v-divider />

                    <h4>{{ $t('evaluation.competencies._') }}</h4>

                    <assessment-competencies-list
                      v-model="selectedCompetencies"
                      :assessment-id="assessmentId"
                      :course-code="courseCode"
                      form
                      :selected="selected"
                      student-view
                    />

                    <v-row>
                      <v-col cols="12" md="12">
                        <v-textarea
                          v-model="explanation"
                          auto-grow
                          clear-icon="mdi-close-circle"
                          clearable
                          filled
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

import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseAssessmentRequestEvaluationPage',
  components: { ValidationObserver },
  mixins: [titles],
  data() {
    return {
      assessment: null,
      course: null,
      explanation: '',
      formBusy: false,
      formError: null,
      preselectedCompetencies: [],
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
      const data = {
        assessment: this.assessmentId,
        competencies: selectedCompetencies,
        explanation: this.explanation,
        instance: this.instance,
      }
      const mutation = require(`~/gql/learn/requestEvaluation.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data.requestEvaluation)

        if (response) {
          const id = response.id
          // this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_CREATE')
          )
          this.$router.push({
            name: 'learn-courses-code-evaluations-id',
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
  meta: {
    roles: ['student'],
  },
}
</script>
