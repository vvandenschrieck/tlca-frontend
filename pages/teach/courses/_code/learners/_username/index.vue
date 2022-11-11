<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getLearner.gql')"
    :variables="{ courseCode, learner: learnerUsername }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">OK : {{ learner }}</v-col>

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
  name: 'TeachLearnerPage',
  mixins: [titles],
  data() {
    return {
      course: null,
      learner: null,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'learner._', 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    learnerUsername() {
      return this.$route.params.username
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.learner = data.registration
      this.title = data.course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
