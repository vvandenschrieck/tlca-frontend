<template>
  <ApolloQuery
    v-slot="{ result: { error, data }, isLoading }"
    :query="require('~/gql/learn/getCourseCompetencies.gql')"
    :variables="{ courseCode: $route.params.code }"
    @result="setTitle"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error && data?.course.isRegistered">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('competency._', 2) }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <competencies-progress-list
                  :items="data?.course.competencies"
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

        <course-schedule-panel
          class="mt-5"
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
  name: 'LearnCourseCompetenciesPage',
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
