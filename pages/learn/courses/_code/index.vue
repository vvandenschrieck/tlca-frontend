<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <progress-info-card :course-code="courseCode" />
            <resources-info-card class="mt-5" :course-code="courseCode" />
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
      course: null,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isRegistered
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setResult({ data: course }) {
      this.course = course
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>
