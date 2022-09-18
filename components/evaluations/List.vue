<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getEvaluationsList.gql')"
    :update="(data) => data.evaluations"
    :variables="{ courseCode }"
    @result="setEvaluations"
  >
    <generic-filter-bar
      v-slot="{ filter: innerFilter, on }"
      v-model="filter"
      class="mt-1"
    >
      <evaluations-filter
        :course-code="courseCode"
        :value="innerFilter"
        v-on="on"
      />
    </generic-filter-bar>

    <v-data-table
      v-if="!error"
      :headers="dataHeaders"
      :items="filteredEvaluations(evaluations, filter)"
      :items-per-page="5"
      :loading="!!isLoading"
      @click:row="goToEvaluation"
    >
      <template #item.assessment="{ value: assessment }">
        {{ assessmentName(assessment) }}
      </template>

      <template #item.date="{ value: date }">
        {{ formatDateTimeFull(date) }}
      </template>

      <template #item.isPublished="{ value: isPublished }">
        <boolean-value-icon :value="isPublished" />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'
import evaluations from '@/mixins/evaluations.js'

export default {
  name: 'EvaluationsList',
  mixins: [datetime, evaluations],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      evaluations: [],
      filter: {},
    }
  },
  computed: {
    dataHeaders() {
      return [
        {
          text: this.$t('evaluation.assessment'),
          value: 'assessment',
        },
        {
          text: this.$t('evaluation.learner'),
          value: 'learner.displayName',
        },
        {
          text: this.$t('evaluation.date'),
          value: 'date',
        },
        {
          align: 'center',
          text: this.$t('evaluation.published'),
          value: 'isPublished',
        },
      ]
    },
  },
  methods: {
    assessmentName(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
    goToEvaluation({ id }) {
      this.$router.push({
        name: 'teach-courses-code-evaluations-id',
        params: { code: this.$route.params.code, id },
      })
    },
    setEvaluations({ data: evaluations }) {
      this.evaluations = evaluations ?? []
    },
  },
}
</script>
