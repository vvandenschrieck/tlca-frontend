<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getEvaluationInfo.gql')"
    :update="(data) => data.evaluation"
    :variables="{ id: evaluationId }"
    @result="setItems"
  >
    <generic-info-panel
      icon="mdi-information"
      :items="items"
      :loading="!!isLoading"
      :title="$t('general.information._')"
    >
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'EvaluationInfoPanel',
  mixins: [datetime],
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    setItems({ data: evaluation }) {
      const items = []

      if (evaluation) {
        // Evaluation date.
        const date = evaluation.date
        items.push({
          icon: 'mdi-calendar-clock',
          text: this.formatDateTimeFull(date),
          tooltip: this.$t('evaluation.date'),
        })
      }

      this.items = items
    },
  },
}
</script>
