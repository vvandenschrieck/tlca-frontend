<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/learn/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
    @result="setTitle"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="course && course.isRegistered">
      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <div>
            {{ course }}
          </div>

          <div>
            <v-btn
              small
              :to="{
                name: 'learn-courses-code-assessments',
                params: { code: $route.params.code },
              }"
            >
              Assessments
            </v-btn>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <progress-panel class="mb-5" :registration="course.registration" />
          <course-schedule-panel :schedule="course.schedule" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnCoursePage',
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name || ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
