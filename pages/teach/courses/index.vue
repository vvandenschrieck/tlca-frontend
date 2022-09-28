<template>
  <ApolloQuery
    :query="require('~/gql/teach/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <h2>{{ title }}</h2>

        <generic-filter-bar
          v-slot="{ filter: innerFilter, on }"
          v-model="filter"
        >
          <courses-filter hide-unpublished :value="innerFilter" v-on="on" />
        </generic-filter-bar>

        <card-list
          class="mt-5"
          :card-props="{ hidePublished: true, space: 'teach' }"
          :component="component"
          :items="filteredCourses(courses, filter)"
          :items-per-page="8"
          prop-name="course"
        />
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'
import courses from '@/mixins/courses.js'

export default {
  name: 'TeachCoursesPage',
  mixins: [courses],
  data() {
    return {
      component: CourseCard,
      filter: {},
      propName: 'course',
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
    roles: ['teacher'],
  },
}
</script>
