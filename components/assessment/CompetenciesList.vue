<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode, teacherView }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <v-list v-if="!error" class="pa-0">
      <template v-for="(competency, i) in competencies">
        <competency-list-item :key="i * 2" :competency="competency" />

        <v-divider v-if="i < competencies.length - 1" :key="i * 2 + 1" />
      </template>
    </v-list>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import authentication from '@/mixins/authentication.js'

export default {
  name: 'AssessmentCompetenciesList',
  mixins: [authentication],
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      competencies: [],
    }
  },
  methods: {
    setCompetencies({ data }) {
      this.competencies =
        data?.assessment.competencies.map((item) => {
          const courseCompetency = data.course.competencies.find(
            (c) => c.competency.code === item.competency.code
          )
          const learningOutcomes = courseCompetency.competency.learningOutcomes

          return {
            ...item,
            useLearningOutcomes: courseCompetency?.useLearningOutcomes,
            learningOutcomes: item.learningOutcomes?.map(
              (lo) => learningOutcomes[lo]
            ),
          }
        }) ?? null
    },
  },
}
</script>
