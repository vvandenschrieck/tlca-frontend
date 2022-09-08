<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/manage/getCourseAssessments.gql')"
    :variables="{ courseCode: $route.params.code }"
    @result="setTitle"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>
              {{ $tc('assessment._', data?.assessments?.length) }}
            </v-tab>

            <!-- <v-tab v-if="data.assessments?.length"> -->
            <v-tab>
              {{ $t('course.assessments.coverage') }}
            </v-tab>

            <!-- <v-tab v-if="hasTimeline(data.course, data.assessments)"> -->
            <v-tab>
              {{ $t('course.assessments.timeline') }}
            </v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <assessments-list
                  v-if="data"
                  :course-code="data.course?.code"
                  :items="data.assessments"
                  hide-openness
                  hide-visibility
                  link-prefix="manage"
                >
                  <template #actions="{ item: { id, isClosed, isHidden } }">
                    <assessment-show-hide-btn :id="id" :is-hidden="isHidden" />
                    <assessment-open-close-btn :id="id" :is-closed="isClosed" />
                  </template>
                </assessments-list>
              </v-tab-item>

              <v-tab-item>
                <!-- <competency-coverage
                  v-if="data"
                  :competencies="data.course.competencies"
                  :assessments="data.assessments"
                /> -->
              </v-tab-item>

              <v-tab-item>
                <assessments-timeline
                  v-if="data"
                  :assessments="data.assessments"
                  :schedule="data.course.schedule"
                  :code="data.course.code"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <assessments-list-info-panel
          v-if="data?.assessments"
          :assessments="data.assessments"
          class="mb-5"
          :code="data.course.code"
        />

        <course-schedule-panel
          :loading="!!isLoading"
          :schedule="data?.course.schedule"
        />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCourseAssessmentsPage',
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.title + ' | ' + this.$t('global.spaces.teach'),
    }
  },
  methods: {
    // hasTimeline(course, assessments) {
    //   if (!assessments?.length) {
    //     return false
    //   }

    //   const hasMinDate =
    //     course.schedule?.some(({ name }) => name === 'start') ||
    //     assessments.some((a) => a.start)

    //   const hasMaxDate =
    //     course.schedule?.some(
    //       ({ name }) => name === 'end' || name === 'evaluationsEnd'
    //     ) || assessments.some((a) => a.end)

    //   return hasMinDate && hasMaxDate
    // },
    setTitle({ data }) {
      this.title = data.course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
