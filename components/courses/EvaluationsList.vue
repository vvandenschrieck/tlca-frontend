<template>
  <div>
    <generic-filter-bar
      v-slot="{ filter: innerFilter, on }"
      v-model="filter"
      class="mt-1"
      :create-link="{
        name: 'teach-courses-code-evaluations-create',
        params: { code: courseCode },
      }"
    >
      <evaluations-filter
        :course-code="courseCode"
        :value="innerFilter"
        v-on="on"
      />
    </generic-filter-bar>

    <v-data-table
      v-if="items"
      :headers="dataHeaders"
      :items="evaluations"
      :items-per-page="5"
      @click:row="gotoEvaluation"
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
  </div>
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
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
    evaluations() {
      return this.filteredEvaluations(this.items, this.filter)
    },
  },
  methods: {
    assessmentName(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
    gotoEvaluation({ id }) {
      this.$router.push({
        name: 'teach-courses-code-evaluations-id',
        params: { code: this.$route.params.code, id },
      })
    },
  },
}
</script>
