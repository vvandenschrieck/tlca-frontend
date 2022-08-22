<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessments.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="course">
        <h2>
          {{ course.name }} -
          {{ $tc('assessment._', course.assessments.length) }}
        </h2>
        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>
                  {{ $tc('assessment._', course.assessments.length) }}
                </v-tab>
                <v-tab
                  v-if="
                    course.competencies?.length && course.assessments?.length
                  "
                >
                  {{ $t('course.competency_coverage') }}
                </v-tab>
                <v-tab v-if="course.assessments?.length && hasTimeline(course)">
                  {{ $t('course.assessments_timeline') }}
                </v-tab>
              </v-tabs>
              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div v-if="course.assessments?.length">
                      <assessments-list
                        :course-code="course.code"
                        :items="course.assessments"
                      />
                    </div>
                    <div
                      v-else-if="
                        course.assessments && !course.assessments.length
                      "
                    >
                      {{ $t('assessment.no') }}
                    </div>
                  </v-tab-item>
                  <v-tab-item
                    v-if="
                      course.competencies?.length && course.assessments?.length
                    "
                  >
                    <competency-coverage
                      :competencies="course.competencies"
                      :assessments="course.assessments"
                    />
                  </v-tab-item>
                  <v-tab-item
                    v-if="course.assessments?.length && hasTimeline(course)"
                  >
                    <assessments-timeline
                      :assessments="course.assessments"
                      :schedule="course.schedule"
                      :code="course.code"
                    />
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
            <!-- <v-skeleton-loader v-else type="table" /> -->
          </v-col>

          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <assessments-list-info-panel
              v-if="course.assessments"
              :assessments="course.assessments"
              :code="course.code"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCourseAssessmentsPage',
  data() {
    return {
      currentTab: '0',
    }
  },
  methods: {
    hasTimeline(course) {
      if (!course.assessments?.length) {
        return false
      }

      const hasMinDate =
        course.schedule?.some(({ name }) => name === 'start') ||
        course.assessments.some((a) => a.start)

      const hasMaxDate =
        course.schedule?.some(
          ({ name }) => name === 'end' || name === 'evaluationsEnd'
        ) || course.assessments.some((a) => a.end)

      return hasMinDate && hasMaxDate
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
