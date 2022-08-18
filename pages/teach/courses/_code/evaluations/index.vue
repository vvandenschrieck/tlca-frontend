<template>
  <ApolloQuery
    v-slot="{ result: { data, error }, isLoading }"
    :query="require('~/gql/teach/getEvaluations.gql')"
    :variables="{ code: $route.params.code }"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card v-if="data">
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>
              {{ $tc('evaluation._', 2) }}
            </v-tab>

            <v-tab>{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <generic-filter-bar
                  v-slot="{ filter: innerFilter, on }"
                  v-model="filter"
                  class="mt-1"
                  :create-link="{
                    name: 'teach-courses-code-evaluations-create',
                    params: { code: $route.params.code },
                  }"
                >
                  <evaluations-filter
                    :course-code="$route.params.code"
                    :value="innerFilter"
                    v-on="on"
                  />
                </generic-filter-bar>

                <v-data-table
                  v-if="data.evaluations"
                  :headers="dataHeaders"
                  :items="filteredEvaluations(data.evaluations, filter)"
                  :items-per-page="5"
                >
                  <template #item.assessment="{ item: { assessment } }">
                    {{ assessment_name(assessment) }}
                  </template>

                  <template #item.date="{ item: { date } }">
                    {{ formatDateTimeFull(date) }}
                  </template>
                </v-data-table>
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
        <course-schedule-panel
          v-if="!!isLoading || data?.course.schedule"
          :loading="!!isLoading"
          :schedule="data?.course.schedule"
        />
      </v-col>
    </v-row>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'
import evaluations from '@/mixins/evaluations.js'

export default {
  name: 'TeachEvaluationsPage',
  mixins: [datetime, evaluations],
  data() {
    return {
      currentTab: 0,
      filter: {},
    }
  },
  head() {
    return {
      title:
        this.$tc('evaluation._', 2) + ' | ' + this.$t('global.spaces.teach'),
    }
  },
  computed: {
    dataHeaders() {
      return [
        {
          text: this.$t('evaluation.assessment'),
          value: 'assessment',
        },
        {
          text: this.$t('evaluation.learner'),
          value: 'learner.displayName',
        },
        {
          groupable: true,
          text: this.$t('evaluation.date'),
          value: 'date',
        },
      ]
    },
    title() {
      return this.$tc('evaluation._', 2)
    },
  },
  methods: {
    assessment_name(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
