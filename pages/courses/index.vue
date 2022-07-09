<template>
  <ApolloQuery :query="require('../../gql/getCourses.gql')">
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <list-page
          :title="title"
          :prop-name="propName"
          :component="component"
          :items="data && data.courses"
        />
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'

export default {
  name: 'CoursesPage',
  data() {
    return {
      propName: 'course',
      component: CourseCard,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$tc('course._', 2)
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>
