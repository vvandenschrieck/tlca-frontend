<template>
  <div>
    <v-col cols="12" md="12">
      <div :style="chartStyle">
        <v-chart autoresize :option="option" @click="goToAssessment" />
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
    code: {
      type: String,
      required: true,
    },
    schedule: {
      type: Array,
      default: () => null,
    },
  },
  computed: {
    chartStyle() {
      let style = 'width: 100%; height: '
      style = style + (this.assessments.length * 40 + 100) + 'px'
      return style
    },
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
      const dates = this.sortedAssessments.map((assessment) =>
        assessment.start ? assessment.start : this.minDate
      )
      return dates
    },
    enddates() {
      const dates = this.sortedAssessments.map((assessment) =>
        assessment.end ? assessment.end : this.maxDate
      )
      return dates
    },
    assessementNames() {
      const names = this.sortedAssessments.map((assessment) => assessment.code)
      return names
    },
    option() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params) => {
            const assessment = this.assessments.filter(
              (assessment) => assessment.code === params[0].name
            )[0]
            let tooltip = assessment.name
            if (assessment.start)
              tooltip +=
                '<br > ' +
                this.$t('assessment.start.date', {
                  start: this.formatDateFull(assessment.start),
                })
            if (assessment.end)
              tooltip +=
                '<br > ' +
                this.$t('assessment.deadline.date', {
                  deadline: this.formatDateFull(assessment.end),
                })
            return tooltip
          },
        },
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
          triggerEvent: true,
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
  methods: {
    goToAssessment(params) {
      if (params.componentType === 'yAxis' && params.value) {
        const assessment = this.assessments.filter(
          (assessment) => assessment.code === params.value
        )[0]
        this.$router.push({
          name: 'manage-courses-code-assessments-id',
          params: {
            code: this.code,
            id: assessment.id,
          },
        })
      }
    },
  },
}
</script>
