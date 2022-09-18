<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentsSchedule.gql')"
    :variables="{ courseCode }"
    @result="setSchedule"
  >
    <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

    <div v-if="!error" :style="chartStyle">
      <v-chart autoresize :option="option" @click="goToAssessment" />
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'AssessmentsTimeline',
  mixins: [assessments, datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assessments: [],
      schedule: null,
    }
  },
  computed: {
    chartStyle() {
      const height = this.assessments.length * 40 + 120
      return `width: 100%; height: ${height}px`
    },
    maxDate() {
      let maxDate = null
      if (this.schedule) {
        for (const event of this.schedule) {
          if (!maxDate && event.name === 'end') maxDate = event.datetime

          if (event.name === 'evaluationsEnd') return event.datetime
        }
        if (maxDate) return maxDate
      }

      maxDate = new Date().toISOString()
      for (const assessment of this.assessments)
        if (assessment.end && assessment.end > maxDate) maxDate = assessment.end
      return maxDate
    },
    minDate() {
      let minDate = null
      if (this.schedule) {
        for (const event of this.schedule) {
          if (event.name === 'start') minDate = event.datetime
        }
      }
      if (minDate) return minDate

      minDate = new Date().toISOString()
      for (const assessment of this.assessments)
        if (assessment.start && assessment.start < minDate)
          minDate = assessment.start
      return minDate
    },
    option() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params) => {
            const assessment = this.assessementById(params[0].name)

            let tooltip = assessment.name
            if (assessment.start)
              tooltip +=
                '<br /> ' +
                this.$t('assessment.start.date', {
                  start: this.formatDateFull(assessment.start),
                })
            if (assessment.end)
              tooltip +=
                '<br /> ' +
                this.$t('assessment.deadline.date', {
                  deadline: this.formatDateFull(assessment.end),
                })

            return tooltip
          },
        },
        xAxis: {
          type: 'time',
          position: 'top',
          // Prevents echarts to freeze if boundaries are not ordered
          min: this.minDate < this.maxDate ? this.minDate : this.maxDate,
          max: this.minDate > this.maxDate ? this.minDate : this.maxDate,
        },
        yAxis: {
          axisLabel: {
            formatter: (value, _) => {
              return this.shortName(this.assessementById(value))
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
          data: this.assessments.map((a) => a.id),
          triggerEvent: true,
          type: 'category',
        },
        series: [
          {
            data: this.assessments.map((a) => a.end ?? this.maxDate),
            itemStyle: {
              borderColor: '#fff',
            },
            stack: 'total',
            type: 'bar',
            z: 1,
          },
          {
            data: this.assessments.map((a) => a.start ?? this.minDate),
            itemStyle: {
              color: '#fff',
            },
            stack: 'total',
            type: 'bar',
            z: 3,
          },
        ],
      }
    },
  },
  methods: {
    assessementById(id) {
      return this.assessments.find((a) => a.id === id)
    },
    goToAssessment(params) {
      if (params.componentType === 'yAxis' && params.value) {
        this.$router.push({
          name: 'manage-courses-code-assessments-id',
          params: {
            code: this.courseCode,
            id: params.value,
          },
        })
      }
    },
    setSchedule({ data }) {
      this.assessments =
        data?.assessments.sort((a, b) => (a.start < b.start ? 1 : -1)) ?? []
      this.schedule = data?.course.schedule ?? []
    },
  },
}
</script>
