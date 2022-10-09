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
                <h4>{{ $t('evaluation.comment._') }}</h4>

                <description-content :text="evaluation?.comment" />

                <h4>{{ $tc('competency._', 2) }}</h4>

                <assessment-competencies-list
                  v-if="evaluation"
                  :assessment-id="evaluation.assessment.id"
                  :course-code="courseCode"
                  :selected="evaluation.competencies"
                />

                <h4>{{ $t('evaluation.note._') }}</h4>

                <description-content :text="evaluation?.note" />
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
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
        :delete-action="{
          query: {
            mutation: require('~/gql/teach/deleteEvaluation.gql'),
            variables: { id: evaluationId },
          },
          link: {
            name: 'teach-courses-code-evaluations',
            params: { code: courseCode },
          },
          object: 'evaluation',
        }"
        @customActionClicked="publish"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import publishEvaluation from '~/gql/teach/publishEvaluation.gql'

export default {
  name: 'TeachEvaluationPage',
  data() {
    return {
      course: null,
      currentTab: 0,
      evaluation: null,
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
      if (!this.evaluation || this.evaluation.isPublished) {
        return null
      }

      return {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('global.publish'),
      }
    },
    evaluationId() {
      return this.$route.params.id
    },
  },
  methods: {
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
