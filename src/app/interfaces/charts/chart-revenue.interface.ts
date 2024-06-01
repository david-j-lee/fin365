import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface ChartRevenue {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
  total: number
}
