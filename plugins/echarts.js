import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'

use([BarChart, CanvasRenderer, GridComponent, TooltipComponent])

Vue.component('VChart', ECharts)
