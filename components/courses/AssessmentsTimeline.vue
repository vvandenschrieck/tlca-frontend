<template>
  <div>
    <v-col cols="12" md="12">
      <div style="width: 100%; height: 500px">
        <v-chart autoresize :option="option" />
      </div>
    </v-col>
  </div>
</template>
<script>
import datetime from '@/mixins/datetime.js'
import '@/plugins/echarts'
export default {
  name: 'AssessmentsTimeline',
  mixins: [datetime],
  props: {
    assessments: {
      type: Array,
      required: true,
    },
    schedule: {
      type: Array,
      default: () => null,
    },
  },
  computed: {
    minDate() {
      let minDate = null
      if (this.schedule) {
        for (const event of this.schedule) {
          if (event.name && event.name === 'start') {
            minDate = event.datetime
          }
        }
      }
      for (const assessment of this.sortedAssessments) {
        if (assessment.start) {
          if (!minDate || assessment.start < minDate) minDate = assessment.start
        }
      }
      return minDate
    },
    maxDate() {
      let maxDate = null
      if (this.schedule) {
        for (const event of this.schedule) {
          if (!maxDate && event.name && event.name === 'end') {
            maxDate = event.datetime
          }
          if (event.name && event.name === 'evaluationsEnd') {
            maxDate = event.datetime
          }
        }
      }
      for (const assessment of this.sortedAssessments) {
        if (assessment.end) {
          if (!maxDate || assessment.end > maxDate) maxDate = assessment.end
        }
      }
      return maxDate
    },
    sortedAssessments() {
      return [...this.assessments].sort((a, b) => (a.start < b.start ? 1 : -1))
    },
    startdates() {
      return this.sortedAssessments.map((assessment) =>
        assessment.start ? assessment.start : this.minDate
      )
    },
    enddates() {
      return this.sortedAssessments.map((assessment) =>
        assessment.end ? assessment.end : this.maxDate
      )
    },
    assessementNames() {
      return this.sortedAssessments.map((assessment) => assessment.code)
    },
    option() {
      return {
        xAxis: {
          type: 'time',
          position: 'top',
          min: this.minDate,
          max: this.maxDate,
        },
        yAxis: {
          type: 'category',
          data: this.assessementNames,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            type: 'bar',
            stack: 'total',
            itemStyle: {
              borderColor: '#fff',
            },
            z: 1,
            data: this.enddates,
          },
          {
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: '#fff',
            },
            z: 3,
            data: this.startdates,
          },
        ],
      }
    },
  },
}
</script>
