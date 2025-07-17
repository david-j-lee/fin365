import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface SummaryChart {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
}
