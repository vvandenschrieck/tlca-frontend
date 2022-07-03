<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <bread-crumb :items="navItems('manage', 'course')" />

        <h2>{{ $tc('course._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <card-list
              :component="component"
              link-prefix="manage-"
              :items="courses"
              :items-per-page="8"
              :cards-per-page="3"
              :prop-name="propName"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <courses-list-info-panel v-if="courses" :courses="courses" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'
import CourseCard from '~/components/cards/CourseCard.vue'

export default {
  name: 'ManageCoursesPage',
  mixins: [breadcrumb],
  data() {
    return {
      propName: 'course',
      component: CourseCard,
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
