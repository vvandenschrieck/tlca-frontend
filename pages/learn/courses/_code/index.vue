<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/learn/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && course?.isRegistered">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <progress-info-card :course-code="courseCode" />
          </v-col>

          <v-col cols="12" md="6">
            <assessments-info-card :course-code="courseCode" space="learn" />
            <evaluations-info-card
              class="mt-5"
              :course-code="courseCode"
              space="learn"
            />
          </v-col>
        </v-row>
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
  name: 'LearnCoursePage',
  mixins: [titles],
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
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
    roles: ['student'],
  },
}
</script>
