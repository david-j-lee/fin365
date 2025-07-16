import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface ChartBalance {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
  total?: number
}
