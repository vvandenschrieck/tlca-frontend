<template>
  <ApolloQuery
    v-slot="{ result: { error, data }, isLoading }"
    :query="require('~/gql/components/getAssessments.gql')"
    :update="(data) => data.assessments"
    :variables="{ courseCode, open: true }"
  >
    <v-autocomplete
      v-if="!error"
      clearable
      dense
      :disabled="!!isLoading"
      :items="assessments(data)"
      item-value="id"
      :label="$t('evaluation.assessment')"
      :loading="!!isLoading"
      :value="value"
      @input="$emit('input', $event)"
    >
      <template #selection="{ item }">
        <span v-if="item.id">{{ assessment_name(item) }}</span>
      </template>

      <template #item="{ item }">
        <span v-if="item.id">{{ assessment_name(item) }}</span>
      </template>
    </v-autocomplete>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentSelectField',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  methods: {
    assessments(data) {
      const assessments = []

      if (data?.length) {
        const categories = [
          ...new Set(data.map((a) => a.category)).map((c) => ({
            category: c,
            text: this.$t(`assessment.category.${c.toLowerCase()}`),
          })),
        ].sort((a, b) => (a.text < b.text ? -1 : 1))

        categories.forEach((c) => {
          assessments.push({ header: c.text })
          assessments.push(...data.filter((a) => a.category === c.category))
        })
      }

      return assessments
    },
    assessment_name(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
  },
}
</script>
