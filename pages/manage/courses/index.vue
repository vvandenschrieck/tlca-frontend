<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <bread-crumb />

        <h2>{{ $tc('course._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <card-list
              :component="component"
              link-prefix="manage-"
              :items="filteredCourses(courses)"
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
              class="mb-5"
            />

            <courses-filter-panel
              v-if="courses"
              v-model="filter"
              hide-role
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

export default {
  name: 'ManageCoursesPage',
  data() {
    return {
      propName: 'course',
      component: CourseCard,
      filter: {},
    }
  },
  methods: {
    filteredCourses(courses) {
      const { status } = this.filter

      if (!status || !status.length) {
        return courses
      }

      return courses.filter((c) => {
        if (!c.isPublished) {
          return status.includes('UNPUBLISHED')
        }
        if (c.isPublished && !c.isArchived) {
          return status.includes('PUBLISHED')
        }
        if (c.isArchived) {
          return status.includes('ARCHIVED')
        }
        return false
      })
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
