import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface PieChart {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
  total: number
}
