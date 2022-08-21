<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-switch
          v-model="showSelected"
          :label="$t('assessment.show_selected')"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedFilter"
          :items="filters"
          :label="$t('assessment.filter_by_competency')"
          clearable
          chips
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      hide-default-footer
      dense
      show-select
      disable-sort
      disable-pagination
      item-class="itemStyle"
      :items-per-page="-1"
      :headers="headers"
      :items="items"
    >
    </v-data-table>
  </div>
</template>

<script>
/* FIXME: refactor the code to make the computed 'items' simpler:
 * - split into smaller chunks
 * - use functional programming notations
 */
export default {
  name: 'CompetencyCoverage',
  props: {
    competencies: {
      type: Array,
      required: true,
    },
    assessments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedFilter: null,
      selected: [],
      showSelected: false,
    }
  },
  computed: {
    filters() {
      const filters = []
      for (const courseCompetency of this.competencies) {
        filters.push(courseCompetency.competency.code)
      }
      return filters
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
      for (const courseCompetency of this.competencies) {
        headers.push({
          text: courseCompetency.competency.code,
          value: courseCompetency.competency.code,
        })
      }
      return headers
    },
    items() {
      // For each competency, get the stars earnable by this assignment
      const items = []
      // Collect ids of assessments that must be shown
      const idToShow = []
      for (const assessment of this.showSelected
        ? this.selected
        : this.assessments)
        if (assessment.id !== 'total') idToShow.push(assessment.id)
      // Initialize dict for stars sum
      const totalStars = {
        name: 'Total',
        id: 'total',
        isSelectable: false,
        itemStyle: 'totalRow',
      }
      for (const courseCompetency of this.competencies) {
        totalStars[courseCompetency.competency.code] = 0
      }
      for (const assessmentId of idToShow) {
        const assessment = this.assessments.filter(
          (x) => x.id === assessmentId
        )[0]
        const row = { name: assessment.code, id: assessment.id }
        const assessmentComp = {}
        // Collect star information for this assigment in a dict instead of a list
        let passFilter = false
        for (const comp of assessment.competencies) {
          assessmentComp[comp.competency.code] = comp.stars
          if (this.selectedFilter === comp.competency.code) passFilter = true
        }
        // Do not display this assignment if it doesn't contain filter competency
        if (this.selectedFilter && !passFilter) continue

        // Collect complete stars information for all competencies
        for (const courseCompetency of this.competencies) {
          if (assessmentComp[courseCompetency.competency.code]) {
            row[courseCompetency.competency.code] =
              assessmentComp[courseCompetency.competency.code]
            // Update total
            totalStars[courseCompetency.competency.code] +=
              assessmentComp[courseCompetency.competency.code]
          } else row[courseCompetency.competency.code] = ''
        }
        items.push(row)
      }
      items.push(totalStars)
      return items
    },
  },
}
</script>
<style>
.totalRow {
  font-weight: bold;
  background-color: lightgray;
}
.totalRow .v-simple-checkbox {
  display: none;
}
</style>
