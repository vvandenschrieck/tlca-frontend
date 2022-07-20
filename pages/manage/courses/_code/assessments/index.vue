<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessments.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="course">
        <h2 v-text="course.name"></h2>
        <v-row>
          <v-col cols="12" md="8">
            <v-card v-if="course.assessments && course.assessments.length">
              <v-list class="pa-0">
                <template v-for="(assessment, i) in course.assessments">
                  <v-list-item
                    :key="assessment.code"
                     :to="{
                      name: 'manage-courses-code-assessments-id',
                      params: { code: course.code, id: assessment.id },
                    }"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <b>{{ assessment.code }}</b> – {{ assessment.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <!-- $t('assessment.category') : {{ assessment.category }} -->
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="i < course.assessments.length - 1" :key="i"></v-divider>
                </template>
              </v-list>
            </v-card>

            <div
              v-else-if="course.assessments && !course.assessments.length"
              v-t="'assessment.no'"
            ></div>
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <assessments-list-info-panel
              v-if="course.assessments"
              :assessments="course.assessments"
            />
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
