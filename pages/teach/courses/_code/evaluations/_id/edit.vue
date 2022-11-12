<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/edit/getEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setResult"
  >
    <page-title :value="title" />

    <v-progress-linear v-if="!!isLoading" indeterminate />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <form-evaluation
          v-if="evaluation"
          :course-code="courseCode"
          edit
          :evaluation="evaluation"
        />
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <evaluation-info-panel
          :evaluation-id="evaluationId"
          hide-assessment
          hide-learner
          teacher-view
        />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachEditEvaluationPage',
  mixins: [titles],
  data() {
    return {
      assessmentId: null,
      course: null,
      evaluation: null,
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return (
        (!this.course && !this.evaluation) ||
        ((this.course.isCoordinator || this.course.isTeacher) &&
          ['ACCEPTED', 'UNPUBLISHED'].includes(this.evaluation.status))
      )
    },
    evaluationId() {
      return this.$route.params.id
    },
    courseCode() {
      return this.$route.params.code
    },
    title() {
      return this.$t('evaluation.edit')
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.evaluation = data.evaluation
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
