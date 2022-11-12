<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="query.query"
    :variables="query.variables"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ tabTitle }}</v-tab>
            <v-tab v-if="showRequest">{{ $t('general.request') }}</v-tab>
            <v-tab>{{ $t('general.history') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <div v-if="showCompetencies">
                  <h4>{{ $tc('competency._', 2) }}</h4>

                  <assessment-competencies-list
                    v-if="evaluation"
                    :assessment-id="evaluation.assessment.id"
                    :course-code="courseCode"
                    :selected="selectedCompetencies"
                    :student-view="hidePrivateChecklist"
                  />
                </div>

                <div v-if="showComment">
                  <h4>{{ $t('evaluation.comment._') }}</h4>

                  <description-content
                    entity="evaluation.comment"
                    :text="evaluation?.comment"
                  />
                </div>

                <div v-if="showExplanation">
                  <h4>{{ $t('evaluation.explanation._') }}</h4>

                  <description-content
                    entity="evaluation.explanation"
                    :text="evaluation?.explanation"
                  />
                </div>

                <div v-if="showRejectionReason">
                  <h4>{{ $t('evaluation.rejectionReason') }}</h4>

                  <description-content :text="evaluation?.rejectionReason" />
                </div>

                <div v-if="showNote">
                  <h4>{{ $t('evaluation.note._') }}</h4>

                  <description-content
                    entity="evaluation.note"
                    :text="evaluation?.note"
                  />
                </div>

                <div v-if="showData">
                  <h4>{{ $t('evaluation.answer._') }}</h4>

                  <tfq-view
                    v-if="assessment?.provider === 'tfq'"
                    :evaluation-id="evaluationId"
                    hide-title
                    teacher-view
                  />
                </div>
              </v-tab-item>

              <v-tab-item v-if="showRequest">
                <h4>{{ $tc('competency._', 2) }}</h4>

                <assessment-competencies-list
                  v-if="evaluation"
                  :assessment-id="evaluation.assessment.id"
                  :course-code="courseCode"
                  :selected="evaluation.requestedCompetencies"
                  student-view
                />

                <h4>{{ $t('evaluation.explanation._') }}</h4>

                <description-content
                  entity="evaluation.explanation"
                  :text="evaluation?.explanation"
                />
              </v-tab-item>

              <v-tab-item>
                <h4>{{ $t('evaluation.status._') }}</h4>

                <evaluation-status-history
                  :evaluation-id="evaluationId"
                  teacher-view
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>

        <div v-if="evaluation?.isRequestPending" class="text-right mt-3">
          <evaluation-request-reject-btn v-if="!hasProvider" @reject="reject" />
          <accept-btn v-if="!hasProvider" @accept="accept" />
          <evaluation-correct-btn
            v-if="showCorrectBtn"
            :loading="correcting"
            @click="correct"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <evaluation-info-panel :evaluation-id="evaluationId" teacher-view />
        <provider-info-panel
          v-if="evaluation?.assessment.hasProvider"
          class="mt-5"
          :evaluation-id="evaluationId"
          teacher-view
        />
      </v-col>

      <actions-menu
        :custom-actions="customActions"
        :delete-action="deleteAction"
        :edit-link="editLink"
        @customActionClicked="onCustomActionClicked"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

import correctEvaluation from '~/gql/teach/correctEvaluation.gql'

export default {
  name: 'TeachEvaluationPage',
  mixins: [titles],
  data() {
    return {
      assessment: null,
      correcting: false,
      course: null,
      currentTab: 0,
      evaluation: null,
      executing: false,
      instance: null,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    customActions() {
      if (
        !this.evaluation ||
        !['ACCEPTED', 'UNPUBLISHED'].includes(this.evaluation.status)
      ) {
        return null
      }

      return [
        {
          icon: 'mdi-cloud-upload',
          key: 'publish',
          tooltip: this.$t('global.publish'),
        },
      ]
    },
    deleteAction() {
      if (
        !this.evaluation ||
        !['PUBLISHED', 'UNPUBLISHED'].includes(this.evaluation.status)
      ) {
        return null
      }

      return {
        query: {
          mutation: require('~/gql/teach/deleteEvaluation.gql'),
          variables: { id: this.evaluationId },
        },
        link: {
          name: 'teach-courses-code-evaluations',
          params: { code: this.courseCode },
        },
        object: 'evaluation',
      }
    },
    editLink() {
      if (
        !this.evaluation ||
        !['ACCEPTED', 'UNPUBLISHED'].includes(this.evaluation.status)
      ) {
        return null
      }

      return {
        name: 'teach-courses-code-evaluations-id-edit',
        params: { code: this.courseCode, id: this.evaluationId },
      }
    },
    evaluationId() {
      return this.$route.params.id
    },
    hasProvider() {
      return this.assessment?.provider
    },
    hidePrivateChecklist() {
      return ['REJECTED', 'REQUESTED'].includes(this.evaluation?.status)
    },
    query() {
      return {
        query: require('~/gql/teach/getEvaluation.gql'),
        variables: {
          courseCode: this.courseCode,
          evaluationId: this.evaluationId,
        },
      }
    },
    selectedCompetencies() {
      if (!this.evaluation) {
        return []
      }

      const selected = []

      // If there are competencies, add them to 'selected', as selected ones.
      if (this.evaluation.competencies?.length) {
        selected.push(...this.evaluation.competencies)
      }

      // If there are past competencies, add them to 'selected', as past ones.
      if (this.evaluation.pastCompetencies?.length) {
        for (const competency of this.evaluation.pastCompetencies) {
          const c = selected.find(
            (c) => c.competency.code === competency.competency.code
          )
          if (!c) {
            selected.push({ ...competency, past: true })
          } else {
            c.pastLearningOutcomes = competency.learningOutcomes ?? undefined
          }
        }
      }

      return selected
    },
    showComment() {
      return (
        !this.hasProvider &&
        ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
          this.evaluation?.status
        )
      )
    },
    showCompetencies() {
      return !this.hasProvider || this.evaluation?.status === 'PUBLISHED'
    },
    showCorrectBtn() {
      return this.hasProvider && this.evaluation?.status === 'REQUESTED'
    },
    showData() {
      return this.hasProvider
    },
    showExplanation() {
      return (
        !this.hasProvider &&
        ['REJECTED', 'REQUESTED'].includes(this.evaluation?.status)
      )
    },
    showNote() {
      return (
        !this.hasProvider &&
        ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
          this.evaluation?.status
        )
      )
    },
    showRejectionReason() {
      return this.evaluation?.status === 'REJECTED'
    },
    showRequest() {
      return this.evaluation?.status === 'ACCEPTED'
    },
    tabTitle() {
      return ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
        this.evaluation?.status
      )
        ? this.$tc('evaluation._', 1)
        : this.$t('general.request')
    },
  },
  methods: {
    async accept() {
      await this.execute({
        key: 'EVALUATION_REQUEST_ACCEPT',
        mutation: require('~/gql/teach/acceptEvaluationRequest.gql'),
        name: 'acceptEvaluationRequest',
        variables: { id: this.evaluationId },
      })
    },
    async correct() {
      if (this.correcting) {
        return
      }

      this.correcting = true
      const data = { id: this.evaluationId }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: correctEvaluation,
            variables: data,
          })
          .then(({ data }) => data && data.correctEvaluation)

        if (response) {
          // TODO: replace with cache update.
          this.evaluation.competencies = response.competencies
          this.evaluation.isRequestPending = false
          this.evaluation.status = 'PUBLISHED'
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_CORRECT')
          )
        }
      } catch {}

      this.correcting = false
    },
    async execute(action) {
      if (this.executing) {
        return
      }

      this.executing = true
      const { key, mutation, name, variables } = action

      try {
        const response = await this.$apollo
          .mutate({ mutation, variables })
          .then(({ data }) => data && data[name])

        if (response) {
          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.${key}`)
          )
        }
      } finally {
        this.executing = false
      }
    },
    async onCustomActionClicked(key) {
      if (key === 'publish') {
        await this.publish()
      }
    },
    async publish() {
      await this.execute({
        key: 'EVALUATION_PUBLISH',
        mutation: require('~/gql/teach/publishEvaluation.gql'),
        name: 'publishEvaluation',
        variables: { id: this.evaluationId },
      })
    },
    async reject(reason) {
      await this.execute({
        key: 'EVALUATION_REQUEST_REJECT',
        mutation: require('~/gql/teach/rejectEvaluationRequest.gql'),
        name: 'rejectEvaluationRequest',
        variables: { id: this.evaluationId, reason },
      })
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.evaluation?.assessment
      this.course = data.course
      this.evaluation = data.evaluation
      this.instance = data.evaluation?.instance
      this.title = data.evaluation?.assessment?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
