import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, GridComponent])

Vue.component('VChart', ECharts)
