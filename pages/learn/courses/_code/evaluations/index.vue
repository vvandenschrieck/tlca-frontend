<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('evaluation._', 2) }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <evaluations-list
                  :course-code="courseCode"
                  hide-filter-bar
                  hide-learner
                  space="learn"
                >
                  <template #actions="{ item: { id, status } }">
                    <evaluation-request-delete-btn
                      v-if="status._ === 'REQUESTED'"
                      :evaluation-id="id"
                      @success="() => onEvaluationRequestDeleted(id)"
                    />
                  </template>
                </evaluations-list>
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
        <progress-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import getEvaluationsList from '@/gql/components/getEvaluationsList.gql'

import titles from '@/mixins/titles.js'

export default {
  name: 'LearnEvaluationsPage',
  mixins: [titles],
  data() {
    return {
      course: null,
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
    canShowContent() {
      return !this.course || this.course.isRegistered
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    onEvaluationRequestDeleted(id) {
      const { defaultClient: apolloClient } = this.$apolloProvider
      const query = {
        query: getEvaluationsList,
        variables: {
          assessmentId: null,
          courseCode: this.courseCode,
          published: null,
          hideAssessment: false,
          hideLearner: false,
        },
      }
      const data = apolloClient.readQuery(query)
      const i = data.evaluations.findIndex((i) => i.id === id)
      apolloClient.writeQuery({
        ...query,
        data: {
          evaluations: [
            ...data.evaluations.slice(0, i),
            ...data.evaluations.slice(i + 1),
          ],
        },
      })

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.EVALUATION_REQUEST_DELETE')
      )
    },
    setResult({ data: course }) {
      this.course = course
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
