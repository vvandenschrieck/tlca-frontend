<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('assessment._', 2) }}</v-tab>
            <v-tab>{{ $t('assessment.coverage') }}</v-tab>
            <v-tab>{{ $t('assessment.timeline') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <assessments-list
                  :course-code="courseCode"
                  hide-openness
                  hide-visibility
                  space="manage"
                >
                  <template #actions="{ item: { id, isClosed, isHidden } }">
                    <assessment-show-hide-btn :id="id" :is-hidden="isHidden" />
                    <assessment-open-close-btn :id="id" :is-closed="isClosed" />
                  </template>
                </assessments-list>
              </v-tab-item>

              <v-tab-item>
                <assessments-coverage :course-code="courseCode" />
              </v-tab-item>

              <v-tab-item>
                <assessments-timeline :course-code="courseCode" />
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
        <assessments-info-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>

      <actions-menu
        :create-link="{
          name: 'manage-courses-code-assessments-create',
          params: { code: courseCode },
        }"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageCourseAssessmentsPage',
  mixins: [titles],
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'assessment._', 'manage'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
