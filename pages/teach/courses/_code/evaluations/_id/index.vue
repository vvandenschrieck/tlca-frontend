<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('evaluation._', 1) }}</v-tab>
            <v-tab>{{ $t('general.history') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <!-- Either show comment (published/unpublished) or explanation (requested) -->
                <div v-if="showComment">
                  <h4>{{ $t('evaluation.comment._') }}</h4>

                  <description-content
                    entity="evaluation.comment"
                    :text="evaluation?.comment"
                  />
                </div>

                <div v-if="showRejectionReason">
                  <h4>{{ $t('evaluation.rejectionReason') }}</h4>

                  <description-content :text="evaluation?.rejectionReason" />
                </div>

                <div v-if="showExplanation">
                  <h4>{{ $t('evaluation.explanation._') }}</h4>

                  <description-content
                    entity="evaluation.explanation"
                    :text="evaluation?.explanation"
                  />
                </div>

                <!-- Show list of competencies and checked items/learning outcomes -->
                <h4>{{ $tc('competency._', 2) }}</h4>

                <assessment-competencies-list
                  v-if="evaluation"
                  :assessment-id="evaluation.assessment.id"
                  :course-code="courseCode"
                  :selected="evaluation.competencies"
                />

                <!-- Show note (published/unpublished) -->
                <div v-if="showNote">
                  <h4>{{ $t('evaluation.note._') }}</h4>

                  <description-content
                    entity="evaluation.note"
                    :text="evaluation?.note"
                  />
                </div>
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>

        <div v-if="evaluation?.isRequestPending" class="text-right mt-3">
          <evaluation-request-reject-btn @reject="reject" />
          <accept-btn @accept="accept" />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <evaluation-info-panel :evaluation-id="evaluationId" teacher-view />
      </v-col>

      <actions-menu
        :custom-action="customAction"
        :delete-action="deleteAction"
        :edit-link="editLink"
        @customActionClicked="publish"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import acceptEvaluationRequest from '~/gql/teach/acceptEvaluationRequest.gql'
import publishEvaluation from '~/gql/teach/publishEvaluation.gql'
import rejectEvaluationRequest from '~/gql/teach/rejectEvaluationRequest.gql'

export default {
  name: 'TeachEvaluationPage',
  data() {
    return {
      course: null,
      currentTab: 0,
      evaluation: null,
      requestHandling: false,
      title: '',
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    customAction() {
      if (
        !this.evaluation ||
        !['ACCEPTED', 'UNPUBLISHED'].includes(this.evaluation.status)
      ) {
        return null
      }

      return {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('global.publish'),
      }
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
    showComment() {
      return ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
        this.evaluation?.status
      )
    },
    showExplanation() {
      return ['ACCEPTED', 'REJECTED', 'REQUESTED'].includes(
        this.evaluation?.status
      )
    },
    showNote() {
      return ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
        this.evaluation?.status
      )
    },
    showRejectionReason() {
      return this.evaluation?.status === 'REJECTED'
    },
  },
  methods: {
    async accept() {
      if (this.requestHandling) {
        return
      }

      this.requestHandling = true
      const data = { id: this.evaluationId }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: acceptEvaluationRequest,
            variables: data,
          })
          .then(({ data }) => data && data.acceptEvaluationRequest)

        if (response) {
          // TODO: replace with cache update.
          this.evaluation.competencies = null
          this.evaluation.isRequestPending = false
          this.evaluation.status = 'ACCEPTED'
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_REQUEST_ACCEPT')
          )
        }
      } catch (err) {}

      this.requestHandling = false
    },
    async publish() {
      const data = { id: this.evaluationId }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: publishEvaluation,
            variables: data,
          })
          .then(({ data }) => data && data.publishEvaluation)

        if (response) {
          // TODO: replace with cache update.
          this.evaluation.isPublished = response.isPublished
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_PUBLISH')
          )
        }
      } catch (err) {}
    },
    async reject(reason) {
      if (this.requestHandling) {
        return
      }

      this.requestHandling = true
      const data = { id: this.evaluationId, reason }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: rejectEvaluationRequest,
            variables: data,
          })
          .then(({ data }) => data && data.rejectEvaluationRequest)

        if (response) {
          // TODO: replace with cache update.
          this.evaluation.competencies = null
          this.evaluation.isRequestPending = false
          this.evaluation.status = 'REJECTED'
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_REQUEST_REJECT')
          )
        }
      } catch (err) {}

      this.requestHandling = false
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.evaluation = data.evaluation
      this.title = data.evaluation?.assessment?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
