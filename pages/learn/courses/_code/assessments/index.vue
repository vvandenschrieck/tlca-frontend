<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <div v-if="!error && canShowContent">
      <v-row>
        <v-col cols="12" md="9">
          <v-card>
            <v-tabs v-model="currentTab" show-arrows>
              <v-tab>{{ $tc('assessment._', 2) }}</v-tab>
              <v-tab>{{ $tc('assessment.work_plan._', 2) }}</v-tab>
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <assessments-list
                    :course-code="courseCode"
                    hide-visibility
                    space="learn"
                  >
                    <template #actions="{ item: { canRequestEvaluation, id } }">
                      <assessment-request-evaluation-btn
                        v-if="canRequestEvaluation"
                        :course-code="courseCode"
                        :assessment-id="id"
                      />
                    </template>
                  </assessments-list>
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
          <progress-panel :course-code="courseCode" />
          <course-schedule-panel class="mt-5" :course-code="courseCode" />
        </v-col>
      </v-row>
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnAssessmentsPage',
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
      title: this.getTitle(this.title, 'assessment._', 'learn'),
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
