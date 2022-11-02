<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getCourse.gql')"
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
            <v-tab>{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <evaluations-list :course-code="courseCode" space="teach">
                  <template #actions="{ item: { id, status } }">
                    <evaluation-publish-btn
                      v-show="['ACCEPTED', 'UNPUBLISHED'].includes(status._)"
                      :evaluation-id="id"
                      @success="onEvaluationPublished"
                    />
                    <evaluation-delete-btn
                      v-if="['PUBLISHED', 'UNPUBLISHED'].includes(status._)"
                      :evaluation-id="id"
                      @success="() => onEvaluationDeleted(id)"
                    />
                  </template>
                </evaluations-list>
              </v-tab-item>

              <v-tab-item>
                <v-alert dense outlined type="info">Upcoming feature</v-alert>
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
        <course-schedule-panel :course-code="courseCode" />
      </v-col>

      <actions-menu :create-link="createLink" />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import getEvaluationsList from '@/gql/components/getEvaluationsList.gql'

import titles from '@/mixins/titles.js'

export default {
  name: 'TeachEvaluationsPage',
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
      title: this.getTitle(this.title, 'evaluation._', 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    createLink() {
      return {
        name: 'teach-courses-code-evaluations-create',
        params: { code: this.courseCode },
      }
    },
  },
  methods: {
    onEvaluationDeleted(id) {
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
        this.$t('success.EVALUATION_DELETE')
      )
    },
    onEvaluationPublished() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.EVALUATION_PUBLISH')
      )
    },
    setResult({ data: course }) {
      this.course = course
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
