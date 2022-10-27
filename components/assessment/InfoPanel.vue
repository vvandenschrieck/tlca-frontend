<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getAssessmentInfo.gql')"
    :update="(data) => data.assessment"
    :variables="{ id: assessmentId, teacherView }"
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
  name: 'AssessmentInfoPanel',
  mixins: [datetime],
  props: {
    assessmentId: {
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
      items: [],
    }
  },
  methods: {
    setItems({ data: assessment }) {
      const items = []

      if (assessment) {
        // Instances.
        const instances = assessment.instances
        items.push({
          icon: 'mdi-layers-triple',
          text: instances
            ? this.$tc('assessment.instance.nb', instances, { n: instances })
            : this.$t('assessment.instance.infinite'),
          tooltip: this.$t('assessment.instance.max_nb'),
        })

        // Type.
        const type = assessment.type
        items.push({
          icon: 'mdi-multiplication-box',
          text: this.$t(`assessment.type.${type.toLowerCase()}`),
          tooltip: this.$t('assessment.type._'),
        })

        // Max takes.
        const takes = assessment.takes
        if (takes && type === 'INCREMENTAL') {
          items.push({
            icon: 'mdi-format-list-numbered',
            text: this.$t('general.max_n', { n: takes }),
            tooltip: this.$t('assessment.takes.max_nb'),
          })
        }

        // Work load.
        const workload = assessment.load?.work
        if (workload) {
          items.push({
            icon: 'mdi-clock-outline',
            text:
              '~' + this.$tc('general.time.minutes', workload, { n: workload }),
            tooltip: this.$t('assessment.load.work'),
          })
        }

        // Oral defense.
        if (assessment.hasOralDefense) {
          const defenseDuration = assessment.load?.defense
          items.push({
            icon: 'mdi-account-voice',
            text: defenseDuration
              ? '~' +
                this.$tc('general.time.minutes', defenseDuration, {
                  n: defenseDuration,
                })
              : this.$t('general.yes'),
            tooltip: this.$t('assessment.load.defense'),
          })
        }

        // Evaluation request.
        if (this.teacherView) {
          const evaluationRequest = assessment.evaluationRequest
          items.push({
            icon: 'mdi-clipboard-edit',
            text: evaluationRequest
              ? this.$t('general.yes')
              : this.$t('general.no'),
            tooltip: this.$t('assessment.evaluation_request'),
          })
        }
      }

      this.items = items
    },
  },
}
</script>
