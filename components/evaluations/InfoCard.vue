<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getEvaluationsInfo.gql')"
    :update="(data) => data.evaluations"
    :variables="{ courseCode, learner }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-clipboard-edit"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('evaluation._', 2)"
    >
      <stats-list v-if="!error" entity="evaluation" :stats="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'EvaluationsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
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
      evaluations: null,
    }
  },
  computed: {
    hasEvaluations() {
      return this.evaluations?.length > 0
    },
    learner() {
      return this.$auth.user.username
    },
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: `${this.space}-courses-code-evaluations`,
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.hasEvaluations) {
        return null
      }

      const items = [
        {
          text: this.$t('evaluation.published'),
          filter: (e) => e.isPublished,
        },
        {
          text: this.$t('evaluation.submitted'),
          filter: (e) => e.isSubmitted,
        },
      ]

      // Compute the evaluations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.evaluations.filter(i.filter)?.length ?? 0,
      }))

      return stats
    },
  },
  methods: {
    setResult({ data: evaluations }) {
      this.evaluations = evaluations
    },
  },
}
</script>
