<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <h2>{{ title }}</h2>

        <generic-filter-bar
          v-slot="{ filter: innerFilter, on }"
          v-model="filter"
          :create-link="{ name: 'manage-courses-create' }"
        >
          <courses-filter hide-roles :value="innerFilter" v-on="on" />
        </generic-filter-bar>

        <card-list
          class="mt-5"
          :card-props="{ space: 'manage' }"
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
  name: 'ManageCoursesPage',
  mixins: [courses],
  data() {
    return {
      filter: {},
      component: CourseCard,
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
