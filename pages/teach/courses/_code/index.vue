<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :spaces="spaces" :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <learners-info-card :course-code="courseCode" />
            <events-info-card class="mt-5" :course-code="courseCode" />
          </v-col>

          <v-col cols="12" md="6">
            <assessments-info-card :course-code="courseCode" space="teach" />
            <evaluations-info-card
              class="mt-5"
              :course-code="courseCode"
              space="teach"
              teacher-view
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-schedule-panel :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachCoursePage',
  mixins: [titles],
  data() {
    return {
      course: null,
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
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (this.course.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code',
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
