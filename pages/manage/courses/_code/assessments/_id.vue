<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessment.gql')"
    :variables="{ courseCode: $route.params.code, assessmentId: $route.params.id }"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="data.course && data.assessment">
        <h2 v-text="data.assessment.name"></h2>

        <v-row>
          <v-col cols="12" md="9">
            <p>TODO: Assessment detail</p>
            <p>{{ data.assessment }}</p>
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
  name: 'ManageCourseAssessmentPage',
  meta: {
    roles: ['teacher'],
  },
}
</script>
