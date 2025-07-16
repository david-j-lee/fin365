import { ChartData, ChartOptions, ChartType } from 'chart.js'

export interface ChartExpense {
  chartType: ChartType
  options: ChartOptions
  data: ChartData
  total?: number
}
