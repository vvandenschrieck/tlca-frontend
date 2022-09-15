<template>
  <ApolloQuery
    v-slot="{ result: { data, error }, isLoading }"
    :query="require('~/gql/teach/getEvaluations.gql')"
    :variables="{ courseCode: $route.params.code }"
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
                <evaluations-list
                  :course-code="data.course.code"
                  :items="data.evaluations"
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

export default {
  name: 'TeachEvaluationsPage',
  mixins: [datetime],
  data() {
    return {
      currentTab: 0,
    }
  },
  head() {
    return {
      title:
        this.$tc('evaluation._', 2) + ' | ' + this.$t('global.spaces.teach'),
    }
  },
  computed: {
    title() {
      return this.$tc('evaluation._', 2)
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
