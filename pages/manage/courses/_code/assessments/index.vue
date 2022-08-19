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
                      <v-list class="pa-0">
                        <template v-for="(assessment, i) in course.assessments">
                          <v-list-item
                            :key="assessment.code"
                            :to="{
                              name: 'manage-courses-code-assessments-id',
                              params: {
                                code: course.code,
                                id: assessment.id,
                              },
                            }"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                <b>{{ assessment.code }}</b>
                                &nbsp;–&nbsp;{{ assessment.name }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider
                            v-if="i < course.assessments.length - 1"
                            :key="i"
                          />
                        </template>
                      </v-list>
                    </div>
                    <div
                      v-else-if="
                        course.assessments && !course.assessments.length
                      "
                    >
                      {{ $t('assessment.no') }}
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <div
                      v-if="
                        course.competencies?.length &&
                        course.assessments?.length
                      "
                    >
                      <competency-coverage
                        :competencies="course.competencies"
                        :assessments="course.assessments"
                      />
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <div
                      v-if="course.assessments?.length && hasTimeline(course)"
                    >
                      <assessments-timeline
                        :assessments="course.assessments"
                        :schedule="course.schedule"
                      />
                    </div>
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
import CompetencyCoverage from '~/components/courses/CompetencyCoverage.vue'
import AssessmentsTimeline from '~/components/courses/AssessmentsTimeline.vue'
export default {
  name: 'ManageCourseAssessmentsPage',
  components: { CompetencyCoverage, AssessmentsTimeline },

  data() {
    return {
      currentTab: '0',
    }
  },
  methods: {
    hasTimeline(course) {
      let hasMinDate = false
      let hasMaxDate = false
      if (course.schedule) {
        for (const event of course.schedule) {
          if (event.name && event.name === 'start') {
            hasMinDate = true
          }
          if (
            event.name &&
            (event.name === 'end' || event.name === 'evaluationsEnd')
          ) {
            hasMaxDate = true
          }
        }
      }
      if (!(hasMinDate && hasMaxDate)) {
        for (const assessment of course.assessments) {
          if (assessment.start) hasMinDate = true
          if (assessment.end) hasMaxDate = true
        }
      }
      return hasMinDate && hasMaxDate
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
