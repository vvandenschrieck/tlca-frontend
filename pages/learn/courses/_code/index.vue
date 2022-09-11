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
          <v-row>
            <v-col cols="12" md="6">
              <progress-info-card :course-code="course.code" />
            </v-col>

            <v-col cols="12" md="6">
              <assessments-info-card :course-code="course.code" space="learn" />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
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
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
