<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :spaces="spaces" :value="title" />

    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <registrations-info-card :course-code="courseCode" />
            <groups-info-card
              v-if="course?.hasGroups"
              class="mt-5"
              :course-code="courseCode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <assessments-info-card
              :course-code="courseCode"
              space="manage"
              :teacher-view="true"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-status-info-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>

      <actions-menu
        :edit-link="{
          name: 'manage-courses-code-edit',
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
  name: 'ManageCoursePage',
  mixins: [titles],
  data() {
    return {
      course: null,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator
    },
    courseCode() {
      return this.$route.params.code
    },
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {}

      if (this.course.isPublished || this.course.isArchived) {
        items.home = {
          name: 'courses-code',
          params: { code: this.courseCode },
        }
        items.teach = {
          name: 'teach-courses-code',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  methods: {
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
