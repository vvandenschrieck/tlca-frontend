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
      item-class="itemStyle"
      :items-per-page="-1"
      :items="items"
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
      competencies: [],
      selectedFilter: null,
      selected: [],
      showSelected: false,
    }
  },
  computed: {
    filters() {
      return this.competencies.map(({ competency }) => competency.code)
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

      this.competencies.forEach(({ competency }) =>
        headers.push({
          text: competency.code,
          value: competency.code,
        })
      )

      return headers
    },
    items() {
      // For each competency, get the stars earnable by this assignment.
      const items = []

      // Collect ids of assessments that must be shown.
      const idToShow = []
      for (const assessment of this.showSelected
        ? this.selected
        : this.assessments)
        if (assessment.id !== 'total') {
          idToShow.push(assessment.id)
        }

      // Initialize dict for stars sum.
      const totalStars = {
        name: 'Total',
        id: 'total',
        isSelectable: false,
        itemStyle: 'totalRow',
      }
      for (const { competency } of this.competencies) {
        totalStars[competency.code] = 0
      }

      for (const assessmentId of idToShow) {
        const assessment = this.assessments.filter(
          (x) => x.id === assessmentId
        )[0]
        const row = {
          name: this.shortName(assessment),
          id: assessment.id,
        }
        const assessmentComp = {}

        // Collect star information for this assigment in a dict instead of a list.
        let passFilter = false
        for (const { competency, stars } of assessment.competencies) {
          assessmentComp[competency.code] = stars
          if (this.selectedFilter === competency.code) passFilter = true
        }

        // Do not display this assignment if it doesn't contain filter competency.
        if (this.selectedFilter && !passFilter) continue

        // Collect complete stars information for all competencies.
        for (const { competency } of this.competencies) {
          if (assessmentComp[competency.code]) {
            row[competency.code] = assessmentComp[competency.code]

            // Update total.
            totalStars[competency.code] += assessmentComp[competency.code]
          } else row[competency.code] = ''
        }
        items.push(row)
      }

      items.push(totalStars)

      return items
    },
  },
  methods: {
    setCompetencies({ data }) {
      this.assessments = data?.assessments ?? []
      this.competencies = data?.course.competencies ?? []
    },
    shortName(assessment) {
      return assessment.code ?? assessment.name.slice(0, 9)
    },
  },
}
</script>

<style scoped>
.totalRow {
  background-color: lightgray;
  font-weight: bold;
}
.totalRow .v-simple-checkbox {
  display: none;
}
</style>
