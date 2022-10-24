<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getAssessmentsInfo.gql')"
    :variables="{ courseCode, teacherView }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-clipboard-text"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('assessment._', 2)"
    >
      <stats-list v-if="!error" entity="assessment" :items="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    hideClosed: {
      type: Boolean,
      default: false,
    },
    space: {
      type: String,
      required: true,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assessments: null,
      course: null,
    }
  },
  computed: {
    hasAssessments() {
      return this.assessments?.length > 0
    },
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: `${this.space}-courses-code-assessments`,
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.hasAssessments) {
        return null
      }

      const isTeacher = this.isCoordinator || this.isTeacher
      const items = [
        {
          text: this.$t('general.available'),
          filter: (a) => !(a.isClosed || a.isHidden),
        },
        {
          text: this.$t('assessment.closed'),
          filter: (a) => a.isClosed,
        },
      ]

      if (!this.hideClosed && isTeacher) {
        items.push({
          text: this.$t('assessment.hidden'),
          filter: (a) => a.isHidden,
        })
      }

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.assessments?.filter(i.filter)?.length ?? 0,
      }))

      // Check if there is no available assessments.
      if (isTeacher && this.teacherView && stats[0].value === 0) {
        stats[0].alert = this.$t('assessment.no_available')
      }

      return stats
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessments = data.assessments
      this.course = data.course
    },
  },
}
</script>
