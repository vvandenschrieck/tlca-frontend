<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessments.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="course">
        <bread-crumb :primary-title="course.code" />

        <h2 v-text="course.name"></h2>

        <v-row>
          <v-col cols="12" md="9">
            <p>TODO: Assessments list</p>
            <p>{{ course.assessments }}</p>
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <p>TODO</p>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCourseAssessmentsPage',
  meta: {
    roles: ['teacher'],
  },
}
</script>
