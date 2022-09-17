<template>
  <ApolloQuery
    v-slot="{ result: { error, data }, isLoading }"
    :query="require('~/gql/teach/getCourseAssessments.gql')"
    :variables="{ courseCode }"
    @result="setTitle"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>
              {{ $tc('evaluation._', 2) }}
            </v-tab>

            <v-tab>{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <assessments-list
                  v-if="data"
                  :course-code="courseCode"
                  :items="data.assessments"
                  hide-actions
                  link-prefix="teach"
                />
              </v-tab-item>

              <v-tab-item>
                <v-alert dense outlined type="info">Upcoming feature</v-alert>
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
        <course-schedule-panel :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachCourseAssessmentsPage',
  mixins: [titles],
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'assessment._', 'teach'),
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
    roles: ['teacher'],
  },
}
</script>
