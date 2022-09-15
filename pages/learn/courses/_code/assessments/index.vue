<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/learn/getCourseAssessments.gql')"
    :variables="{ courseCode: $route.params.code }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>
              {{ $tc('assessment._', 2) }}
            </v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <assessments-list
                  v-if="data"
                  :course-code="data.course?.code"
                  :items="data.assessments"
                  hide-actions
                  hide-visibility
                  link-prefix="learn"
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
        <progress-panel
          :loading="!!isLoading"
          :registration="data?.registration"
        />

        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnCourseAssessmentsPage',
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.title + ' | ' + this.$t('global.spaces.learn'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data }) {
      this.title = data?.course.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
