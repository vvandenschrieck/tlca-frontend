<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getEvaluationInfo.gql')"
    :update="(data) => data.evaluation"
    :variables="{ id: evaluationId, teacherView }"
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
import assessments from '@/mixins/assessments.js'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'EvaluationInfoPanel',
  mixins: [assessments, datetime],
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
    hideAssessment: {
      type: Boolean,
      default: false,
    },
    hideLearner: {
      type: Boolean,
      default: false,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    setItems({ data: evaluation }) {
      if (!evaluation) {
        return []
      }

      const items = []

      // Assessment name.
      if (!this.hideAssessment) {
        const assessment = evaluation.assessment
        items.push({
          icon: 'mdi-clipboard-text',
          text: this.shortName(assessment),
          tooltip: this.$t('evaluation.assessment'),
        })
      }

      // Evaluated learner.
      if (!this.hideLearner) {
        const learner = evaluation.learner
        items.push({
          icon: 'mdi-account-school',
          text: learner.displayName,
          tooltip: this.$t('evaluation.learner'),
        })
      }

      // Evaluator.
      const evaluator = evaluation.evaluator
      if (evaluator) {
        items.push({
          icon: 'mdi-account-school',
          text: evaluator.displayName,
          tooltip: this.$t('evaluation.evaluator'),
        })
      }

      // Status.
      const status = {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('evaluation.status._'),
      }
      switch (evaluation.status) {
        case 'PUBLISHED':
          status.text = this.$t('evaluation.status.published_on', {
            date: this.formatDateFull(evaluation.published),
          })
          break

        case 'ACCEPTED':
        case 'REJECTED':
        case 'REQUESTED':
          status.text = this.$t('evaluation.status.requested_on', {
            date: this.formatDateFull(evaluation.requested),
          })
          break

        case 'UNPUBLISHED':
          status.text = this.$t('evaluation.status.unpublished')
          break
      }
      items.push(status)

      if (
        evaluation.status === 'ACCEPTED' ||
        evaluation.status === 'REJECTED'
      ) {
        items.push({
          text: this.$t(`evaluation.status.${evaluation.status.toLowerCase()}`),
          status: evaluation.status === 'ACCEPTED' ? 'success' : 'error',
        })
      }

      // Evaluation date.
      const date = evaluation.date
      if (
        ['PUBLISHED', 'UNPUBLISHED'].includes(evaluation.status) ||
        (this.teacherView && evaluation.status === 'ACCEPTED')
      ) {
        items.push({
          icon: 'mdi-calendar-clock',
          text: this.formatDateTimeFull(date),
          tooltip: this.$t('evaluation.date'),
        })
      }

      // Creation date.
      // if (this.teacherView) {
      //   const created = evaluation.created
      //   if (
      //     created &&
      //     (evaluation.status !== 'PUBLISHED' || created !== date)
      //   ) {
      //     items.push({
      //       icon: 'mdi-calendar-clock',
      //       text: this.formatDateTimeFull(created),
      //       tooltip: this.$t('evaluation.created'),
      //     })
      //   }
      // }

      this.items = items
    },
  },
}
</script>
