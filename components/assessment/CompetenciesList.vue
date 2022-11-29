<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode, teacherView: !studentView }"
    @result="setResult"
  >
    <v-progress-linear v-if="isLoading" indeterminate />

    <!-- Only show one set of competencies (for the assessment or one of its phases) -->
    <v-list v-if="!error && !showPhases" class="pa-0">
      <template v-for="(competency, i) in competencies">
        <competency-list-item
          :key="i * 2"
          v-model="selectedCompetencies[i]"
          :competency="competency"
          :form="form"
          :hide-checklist="hideChecklist"
          :readonly="readonly"
          :student-view="studentView"
        />

        <v-divider v-if="i < competencies.length - 1" :key="i * 2 + 1" />
      </template>
    </v-list>

    <!-- Show the set of competencies for each phase of the  assessment -->
    <assessment-phases
      v-else-if="!error && showPhases"
      v-slot="{ phase: phaseConfig }"
      :assessment="assessment"
    >
      <v-list class="pa-0">
        <template v-for="(competency, i) in phaseConfig.competencies">
          <competency-list-item
            :key="i * 2"
            :competency="competency"
            :hide-checklist="hideChecklist"
            :readonly="readonly"
            :student-view="studentView"
          />

          <v-divider
            v-if="i < phaseConfig.competencies.length - 1"
            :key="i * 2 + 1"
          />
        </template>
      </v-list>
    </assessment-phases>

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
    phase: {
      type: Number,
      default: null,
    },
    readonly: {
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
      assessment: null,
      course: null,
      selectedCompetencies: [],
    }
  },
  computed: {
    competencies() {
      return this.assessment?.type === 'PHASED' && this.phase !== null
        ? this.assessment?.phases[this.phase].competencies
        : this.assessment?.competencies ?? []
    },
    competenciesLoaded() {
      return (
        (this.assessment?.type !== 'PHASED' && this.assessment?.competencies) ||
        (this.phase !== null && this.assessment?.phases?.length)
      )
    },
    showPhases() {
      return this.assessment?.type === 'PHASED' && this.phase === null
    },
  },
  watch: {
    assessment() {
      if (this.competenciesLoaded) {
        this.updateSelectedCompetencies()
      }
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
    getCompetency(item) {
      if (!this.course) {
        return null
      }

      const competencies = this.course.competencies
      const courseCompetency = competencies.find(
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
    },
    initialiseCompetencies(competencies) {
      return competencies?.map((item) => this.getCompetency(item))
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course

      // Set up the assessment and initialise the competencies.
      const assessment = data.assessment
      if (!assessment) {
        return
      }

      this.assessment = {
        ...assessment,
        competencies: this.initialiseCompetencies(assessment.competencies),
        phases: assessment.phases?.map((phase) => ({
          ...phase,
          competencies: this.initialiseCompetencies(phase.competencies),
        })),
      }
    },
    updateSelectedCompetencies() {
      if (
        this.competenciesLoaded &&
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
