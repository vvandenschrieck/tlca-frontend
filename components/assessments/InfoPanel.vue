<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getAssessmentsInfo.gql')"
    :update="(data) => data.assessments"
    :variables="{ courseCode }"
    @result="setAssessments"
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
export default {
  name: 'AssessmentsInfoPanel',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assessments: [],
    }
  },
  computed: {
    items() {
      const items = []

      // Total number of assessments.
      items.push({
        icon: 'mdi-clipboard-text',
        text: this.$tc('assessment.nb', this.assessments.length, {
          nb: this.assessments.length,
        }),
        tooltip: this.$t('assessment.nb_of'),
      })

      return items
    },
  },
  methods: {
    setAssessments({ data: assessments }) {
      this.assessments = assessments ?? []
    },
  },
}
</script>
