<template>
  <ApolloQuery
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
    @result="setTitle"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="course && (course.isCoordinator || course.isTeacher)">
        <space-switcher :items="spaces(course)" />

        <h2>{{ title }}</h2>

        <course-schedule v-if="course.schedule" :items="course.schedule" />
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
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
      this.title = course.name
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
