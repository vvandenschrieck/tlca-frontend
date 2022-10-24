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
      <stats-list v-if="!error" entity="evaluation" :items="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
import { DateTime } from 'luxon'

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
          text: this.$t('evaluation.status.published'),
          filter: (e) => e.status === 'PUBLISHED',
        },
        {
          text: this.$t('evaluation.status.unpublished'),
          filter: (e) => e.status === 'UNPUBLISHED',
        },
        {
          text: this.$t('evaluation.status.requested'),
          filter: (e) => e.status === 'REQUESTED',
        },
      ]

      // Compute the evaluations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.evaluations.filter(i.filter)?.length ?? 0,
      }))

      // Check the oldest evaluation request, if any.
      if (stats[2].value) {
        const oldest = this.evaluations
          .filter(stats[2].filter)
          .map((e) => DateTime.fromISO(e.requested))
          .sort((a, b) => a - b)[0]

        const days = Math.trunc(DateTime.now().diff(oldest, 'days').values.days)
        if (days > 5) {
          stats[2].alert = this.$t(`evaluation.request.too_old`, { days })
        }
      }

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
