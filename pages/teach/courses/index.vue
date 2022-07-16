<template>
  <ApolloQuery
    :query="require('~/gql/teach/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <h2>{{ $tc('course._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <card-list
              :component="component"
              link-prefix="teach-"
              :items="filteredCourses(courses, filter)"
              :items-per-page="6"
              :cards-per-page="3"
              :prop-name="propName"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <courses-list-info-panel
              v-if="courses"
              :courses="courses"
              hide-unpublished
              hide-create-action
              class="mb-5"
            />

            <courses-filter-panel
              v-if="courses"
              v-model="filter"
              hide-unpublished
              hide-create-action
            ></courses-filter-panel>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
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
      propName: 'course',
      component: CourseCard,
      filter: {},
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
