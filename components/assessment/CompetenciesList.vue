<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode, teacherView: !studentView }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="isLoading" indeterminate />

    <v-list v-if="!error" class="pa-0">
      <template v-for="(competency, i) in competencies">
        <competency-list-item
          :key="i * 2"
          v-model="selectedCompetencies[i]"
          :competency="competency"
          :form="form"
          :hide-checklist="hideChecklist"
          :student-view="studentView"
        />

        <v-divider v-if="i < competencies.length - 1" :key="i * 2 + 1" />
      </template>
    </v-list>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentCompetenciesList',
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Boolean,
      default: false,
    },
    hideChecklist: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: null,
    },
    studentView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      competencies: [],
      selectedCompetencies: [],
    }
  },
  watch: {
    competencies() {
      this.updateSelectedCompetencies()
    },
    selected() {
      this.updateSelectedCompetencies()
    },
    selectedCompetencies() {
      this.updateSelectedCompetencies()
      this.$emit('input', this.selectedCompetencies)
    },
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
        }) ?? []
    },
    updateSelectedCompetencies() {
      if (
        this.competencies &&
        this.selected?.length &&
        this.selectedCompetencies
      ) {
        this.selected.forEach((c) => {
          const competency = this.selectedCompetencies.find(
            ({ competency: code }) =>
              (c.competency.code ?? c.competency) === code
          )

          if (competency) {
            competency.checklist = c.checklist ?? {}
            competency.disabled = c.disabled
            competency.learningOutcomes =
              c.learningOutcomes?.map((lo, i) => {
                const past = c.pastLearningOutcomes
                  ? c.pastLearningOutcomes[i]
                  : false
                return {
                  disabled: lo && this.form && !this.edit,
                  past,
                  selected: lo || past,
                }
              }) ?? []
            competency.past = c.past
            competency.selected = c.selected
          }
        })
      }
    },
  },
}
</script>
