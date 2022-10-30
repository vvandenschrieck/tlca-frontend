<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="query.path"
    :update="(data) => data.assessment ?? data.evaluation"
    :variables="query.variables"
    @result="setItems"
  >
    <generic-info-panel
      icon="mdi-information"
      :items="items"
      :loading="!!isLoading"
      :title="$t('provider._')"
    >
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'ProviderInfoPanel',
  mixins: [datetime],
  props: {
    evaluationId: {
      type: String,
      default: null,
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
  computed: {
    query() {
      const path = this.evaluationId ? 'Evaluation' : 'Assessment'
      const id = this.evaluationId
        ? { evaluationId: this.evaluationId }
        : { assessmentId: this.assessmentId }

      return {
        path: require(`~/gql/provider/get${path}Info.gql`),
        variables: {
          ...id,
          teacherView: this.teacherView,
        },
      }
    },
  },
  methods: {
    setItems({ data }) {
      if (!data) {
        return []
      }

      const assessment = data.assessment ?? data
      const items = []

      // Assessment provider.
      const provider = assessment.provider
      if (provider) {
        items.push({
          icon: 'mdi-database-cog',
          text: this.$t(`provider.${provider}._`),
          tooltip: this.$t('provider._'),
        })
      }

      // Max time.
      const maxTime = assessment.providerConfig?.maxTime
      if (this.teacherView && maxTime) {
        items.push({
          icon: 'mdi-timer',
          text: this.$t('provider.general.max_time_seconds', { time: maxTime }),
          tooltip: this.$t('provider.general.max_time'),
        })
      }

      this.items = items
    },
  },
}
</script>
