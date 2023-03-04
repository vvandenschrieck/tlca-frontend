<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getAssessmentTakesInfo.gql')"
    :update="(data) => data.assessment"
    :variables="{ id: assessmentId }"
    @result="setResult"
  >
    <generic-info-panel
      icon="mdi-information"
      :items="items"
      :loading="!!isLoading"
      :title="$tc('evaluation._', 2)"
    >
      <v-card-text v-if="!error && assessment">
        <assessment-takes-status :assessment="assessment" />
      </v-card-text>
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentTakesInfoPanel',
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assessment: null,
    }
  },
  computed: {
    items() {
      if (!this.assessment) {
        return []
      }

      const items = []

      // Assessment instances counter.
      const nbInstances = this.assessment.nbInstances
      const maxInstances = this.assessment.instances ?? nbInstances + 1
      const maxInstancesText =
        this.assessment.instances ?? this.$t('general.infinity')
      items.push({
        icon: 'mdi-progress-check',
        percentage: (nbInstances * 100) / maxInstances,
        text: `${nbInstances} / ${maxInstancesText}`,
        tooltip: this.$t('assessment.instances_status'),
      })

      // Assessment takes status.
      const takesStatus = this.assessment.takesStatus.status
      items.push({
        icon: 'mdi-traffic-light',
        text: takesStatus,
        tooltip: this.$t('assessment.takes_status._'),
      })

      return items
    },
  },
  methods: {
    setResult({ data: assessment }) {
      if (!assessment) {
        return
      }

      this.assessment = assessment
    },
  },
}
</script>
