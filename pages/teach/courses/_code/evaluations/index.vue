<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('evaluation._', 2) }}</v-tab>
            <v-tab>{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <evaluations-list :course-code="courseCode" />
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

      <actions-menu
        :create-link="{
          name: 'teach-courses-code-evaluations-create',
          params: { code: courseCode },
        }"
      />
    </v-row>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachEvaluationsPage',
  mixins: [datetime, titles],
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'evaluation._', 'teach'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
