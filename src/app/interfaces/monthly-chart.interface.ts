import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface MonthlyChart {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
}
