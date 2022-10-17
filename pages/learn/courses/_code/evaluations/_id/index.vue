<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/learn/getCourseEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && data?.course?.isRegistered">
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
                <div v-if="showComment(data)">
                  <h4>{{ $t('evaluation.comment._') }}</h4>

                  <description-content
                    entity="evaluation.comment"
                    :text="data?.evaluation?.comment"
                  />
                </div>

                <div v-if="showRejectionReason(data)">
                  <h4>{{ $t('evaluation.rejectionReason') }}</h4>

                  <description-content
                    :text="data?.evaluation?.rejectionReason"
                  />
                </div>

                <div v-if="showExplanation(data)">
                  <h4>{{ $t('evaluation.explanation._') }}</h4>

                  <description-content
                    entity="evaluation.explanation"
                    :text="data?.evaluation?.explanation"
                  />
                </div>

                <!-- Show list of competencies and checked items/learning outcomes -->
                <h4>{{ $tc('competency._', 2) }}</h4>

                <assessment-competencies-list
                  v-if="data?.evaluation"
                  :assessment-id="data.evaluation.assessment.id"
                  :course-code="courseCode"
                  :selected="data?.evaluation.competencies"
                  student-view
                />
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
        <evaluation-info-panel :evaluation-id="evaluationId" hide-learner />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseEvaluationPage',
  mixins: [titles],
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'evaluation._', 'learn'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
    evaluationId() {
      return this.$route.params.id
    },
  },
  methods: {
    setTitle({ data }) {
      this.title = data?.evaluation?.assessment.name ?? ''
    },
    showComment(data) {
      return ['ACCEPTED', 'PUBLISHED', 'UNPUBLISHED'].includes(
        data?.evaluation?.status
      )
    },
    showExplanation(data) {
      return ['ACCEPTED', 'REJECTED', 'REQUESTED'].includes(
        data?.evaluation?.status
      )
    },
    showRejectionReason(data) {
      return data?.evaluation?.status === 'REJECTED'
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
