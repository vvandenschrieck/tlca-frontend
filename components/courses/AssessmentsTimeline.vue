<template>
  <div>
    <!-- <v-row v-for="assessment in assessments" :key="assessment">
      <v-col cols="12" sm="6">
        {{ assessment.name }} : {{ assessment.start }} -
        {{ assessment.end }}
      </v-col>
    </v-row> -->
    <v-row>
      <BarChart :options="chartOptionsBar"></BarChart>
    </v-row>
  </div>
</template>
<script>
import datetime from '@/mixins/datetime.js'
import '@/plugins/echarts'
export default {
  name: 'AssessmentsTimeline',
  mixins: [datetime],
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
  data: () => ({
    chartOptionsBar: {
      xAxis: {
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          data: [63, 75, 24, 92],
        },
      ],
    },
  }),
}
</script>
