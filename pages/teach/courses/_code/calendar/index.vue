<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/teach/getCourseCalendar.gql')"
    :variables="{ courseCode: $route.params.code }"
    @result="setTitle"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />
        <events-calendar
          v-if="data?.events"
          :course-code="$route.params.code"
          :items="data.events"
        />
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-schedule-panel
          :loading="!!isLoading"
          :schedule="data?.course.schedule"
        />
      </v-col>
    </v-row>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeachCourseCalendarPage',
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.title + ' | ' + this.$t('global.spaces.teach'),
    }
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
