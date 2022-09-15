<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
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
              params: { code: $route.params.code },
            }"
          >
            Learners
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-assessments',
              params: { code: $route.params.code },
            }"
          >
            Assessments
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-evaluations',
              params: { code: $route.params.code },
            }"
          >
            Evaluations
          </v-btn>

          <v-btn
            small
            :to="{
              name: 'teach-courses-code-calendar',
              params: { code: $route.params.code },
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
          <course-schedule-panel :schedule="course.schedule" />
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
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name || ''
    },
    spaces(course) {
      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.$route.params.code },
        },
      }

      if (course.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code',
          params: { code: this.$route.params.code },
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
