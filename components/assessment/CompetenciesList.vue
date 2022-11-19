<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode, teacherView: !studentView }"
    @result="setResult"
  >
    <v-progress-linear v-if="isLoading" indeterminate />

    <v-list v-if="!error && assessment?.type !== 'PHASED'" class="pa-0">
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

    <assessment-phases
      v-else-if="!error && assessment?.type === 'PHASED'"
      v-slot="{ phase }"
      :assessment="assessment"
    >
      <v-list class="pa-0">
        <template v-for="(competency, i) in phase.competencies">
          <competency-list-item
            :key="i * 2"
            :competency="competency"
            :hide-checklist="hideChecklist"
            :student-view="studentView"
          />

          <v-divider
            v-if="i < phase.competencies.length - 1"
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
    // assessment() {
    //   if (!this.data) {
    //     return null
    //   }

    //   const assessment = this.data.assessment
    //   return {
    //     ...assessment,
    //     competencies: assessment.competencies?.map((item) =>
    //       this.getCompetency(item)
    //     ),
    //     phases: assessment.phases?.map((phase) => ({
    //       ...phase,
    //       competencies: phase.competencies?.map((item) =>
    //         this.getCompetency(item)
    //       ),
    //     })),
    //   }
    // },
    competencies() {
      return this.assessment?.competencies ?? []
    },
  },
  watch: {
    assessment() {
      if (this.assessment.competencies) {
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
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course

      if (data.assessment) {
        this.assessment = {
          ...data.assessment,
          competencies: data.assessment.competencies?.map((item) =>
            this.getCompetency(item)
          ),
          phases: data.assessment.phases?.map((phase) => ({
            ...phase,
            competencies: phase.competencies?.map((item) =>
              this.getCompetency(item)
            ),
          })),
        }
      }
    },
    updateSelectedCompetencies() {
      if (
        this.assessment.competencies &&
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
  // apollo: {
  //   data: {
  //     query: require('~/gql/components/getAssessmentCompetencies.gql'),
  //     update: (data) => data,
  //     variables() {
  //       return {
  //         assessmentId: this.assessmentId,
  //         courseCode: this.courseCode,
  //         teacherView: !this.studentView,
  //       }
  //     },
  //   },
  // },
}
</script>
