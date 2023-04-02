<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentsCompetencies.gql')"
    :variables="{ courseCode }"
    @result="setCompetencies"
  >
    <v-row>
      <v-col cols="12" sm="6">
        <v-switch
          v-model="showSelected"
          dense
          :label="$t('assessment.show_selected')"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedFilter"
          chips
          clearable
          dense
          :items="filters"
          :label="$t('assessment.filter_by_competency')"
          small-chips
        />
      </v-col>
    </v-row>

    <v-data-table
      v-if="!error"
      v-model="selected"
      dense
      disable-pagination
      disable-sort
      :headers="headers"
      hide-default-footer
      :items-per-page="-1"
      :items="items"
      item-class="rowClass"
      :loading="!!isLoading"
      show-select
    >
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'

export default {
  name: 'AssessmentsCoverage',
  mixins: [assessments],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assessments: [],
      course_competencies: [],
      selectedFilter: null,
      selected: [],
      showSelected: false,
    }
  },
  computed: {
    filters() {
      return this.course_competencies.map(({ competency }) => competency.code)
    },
    headers() {
      const headers = [
        {
          text: this.$tc('assessment._', 1),
          align: 'start',
          sortable: false,
          value: 'name',
        },
      ]

      this.course_competencies.forEach(({ competency }) =>
        headers.push({
          text: competency.code,
          value: competency.code,
        })
      )

      return headers
    },
    items() {
      const items = []

      // Collect ids of assessments that must be shown.
      const idToShow = []
      for (const assessment of this.showSelected
        ? this.selected
        : this.assessments)
        if (assessment.id !== 'total') {
          idToShow.push(assessment.id)
        }

      // Initialize total row properties
      const totalStarsOrLO = {
        name: this.$t('assessment.coverage'),
        id: 'total',
        isSelectable: false,
        rowClass: 'totalRow',
      }
      // Initialize dict for stars/LO total computation.
      for (const { competency } of this.course_competencies) {
        if (competency.learningOutcomes) totalStarsOrLO[competency.code] = []
        else totalStarsOrLO[competency.code] = 0
      }
      //
      for (const assessmentId of idToShow) {
        const assessment = this.assessments.filter(
          (x) => x.id === assessmentId
        )[0]
        const row = {
          name: this.shortName(assessment),
          id: assessment.id,
        }
        const assessmentComp = {}

        // Collect star/LO information for this assigment in a dict instead of a list.
        let passFilter = false
        for (const {
          competency,
          stars,
          learningOutcomes,
        } of assessment.competencies) {
          if (!stars) {
            assessmentComp[competency.code] = []
            for (const learningOutcome of learningOutcomes) {
              assessmentComp[competency.code].push(
                this.$t('competency.learning_outcomes.abbr') +
                  (learningOutcome + 1)
              )
            }
          }
          if (!learningOutcomes) assessmentComp[competency.code] = stars

          if (this.selectedFilter === competency.code) passFilter = true
        }

        // Do not consider this assignment if it doesn't contain filter competency.
        if (this.selectedFilter && !passFilter) continue

        // Collect LO/stars information for this assignment.
        for (const { competency } of this.course_competencies) {
          if (assessmentComp[competency.code]) {
            row[competency.code] = assessmentComp[competency.code]
            // Update total if LO
            if (competency.learningOutcomes) {
              for (const learningOutcome of assessmentComp[competency.code]) {
                if (!totalStarsOrLO[competency.code].includes(learningOutcome))
                  totalStarsOrLO[competency.code].push(learningOutcome)
              }
            } // Update total if stars.
            else
              totalStarsOrLO[competency.code] += assessmentComp[competency.code]
          } else row[competency.code] = ''
        }
        items.push(row)
      }
      // Reformat LO/Stars coverage information.
      for (const { competency } of this.course_competencies) {
        if (competency.learningOutcomes) {
          totalStarsOrLO[competency.code] =
            totalStarsOrLO[competency.code].length +
            '/' +
            competency.learningOutcomes.length
        } else
          totalStarsOrLO[competency.code] =
            totalStarsOrLO[competency.code] + '/5'
      }
      items.push(totalStarsOrLO)

      return items
    },
  },
  methods: {
    setCompetencies({ data }) {
      this.assessments = data?.assessments ?? []
      this.course_competencies = data?.course.competencies ?? []
    },
    shortName(assessment) {
      return assessment.code ?? assessment.name.slice(0, 9)
    },
  },
}
</script>

<style>
tr.totalRow {
  background-color: lightgray;
  font-weight: bold !important;
}
.totalRow .v-simple-checkbox--disabled {
  display: none;
}
</style>
