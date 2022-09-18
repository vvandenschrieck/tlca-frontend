<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="course && (course.isCoordinator || course.isTeacher)">
      <space-switcher :items="spaces(course)" />

      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-btn
            small
            :to="{
              name: 'teach-courses-code-learners',
              params: { code: courseCode },
            }"
          >
            Learners
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-assessments',
              params: { code: courseCode },
            }"
          >
            Assessments
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-evaluations',
              params: { code: courseCode },
            }"
          >
            Evaluations
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-calendar',
              params: { code: courseCode },
            }"
          >
            Calendar
          </v-btn>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <course-schedule-panel :course-code="courseCode" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeachCoursePage',
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name || ''
    },
    spaces(course) {
      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (course.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
