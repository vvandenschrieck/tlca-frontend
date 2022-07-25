<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessments.gql')"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="data.course">
        <h2>
          {{ data.course.name }} -
          {{ $tc('assessment._', data.course.assessments.length) }}
        </h2>
        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>
                  {{ $tc('assessment._', data.course.assessments.length) }}
                </v-tab>
                <v-tab v-if="data.course.competencies?.length">
                  {{ $t('course.competency_coverage') }}
                </v-tab>
              </v-tabs>
              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div
                      v-if="
                        data.course.assessments &&
                        data.course.assessments.length
                      "
                    >
                      <v-list class="pa-0">
                        <template
                          v-for="(assessment, i) in data.course.assessments"
                        >
                          <v-list-item
                            :key="assessment.code"
                            :to="{
                              name: 'manage-courses-code-assessments-id',
                              params: {
                                code: data.course.code,
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
                            v-if="i < data.course.assessments.length - 1"
                            :key="i"
                          />
                        </template>
                      </v-list>
                    </div>
                    <div
                      v-else-if="
                        data.course.assessments &&
                        !data.course.assessments.length
                      "
                    >
                      {{ $t('assessment.no') }}
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <competency-coverage
                      :competencies="data.course.competencies"
                      :assessments="data.course.assessments"
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
              v-if="data.course.assessments"
              :assessments="data.course.assessments"
              :code="data.course.code"
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
export default {
  name: 'ManageCourseAssessmentsPage',
  components: { CompetencyCoverage },
  data() {
    return {
      currentTab: '0',
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
