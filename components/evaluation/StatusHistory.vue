<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getEvaluationStatusHistory.gql')"
    :update="(data) => data.evaluation"
    :variables="{ id: evaluationId, teacherView }"
    @result="setResult"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <schedule-timeline :items="items" name-prefix="evaluation.status" />
    </div>
    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'EvaluationStatusHistory',
  mixins: [datetime],
  props: {
    evaluationId: {
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
      evaluation: null,
    }
  },
  computed: {
    items() {
      if (!this.evaluation) {
        return []
      }

      const items = []

      // Add accepted and rejected dates, events only visible to the teacher.
      if (this.teacherView) {
        for (const name of ['accepted', 'rejected']) {
          if (this.evaluation[name]) {
            items.push({
              name,
              datetime: this.evaluation[name],
            })
          }
        }
      }

      // Add published and requested dates.
      for (const name of ['published', 'requested']) {
        if (this.evaluation[name]) {
          items.push({
            name,
            datetime: this.evaluation[name],
          })
        }
      }

      return items
    },
  },
  methods: {
    setResult({ data: evaluation }) {
      this.evaluation = evaluation
    },
  },
}
</script>
