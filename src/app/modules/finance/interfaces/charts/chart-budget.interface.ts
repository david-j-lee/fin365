import { ChartData, ChartOptions, ChartType } from 'chart.js';

export interface ChartBudget {
  chartType: ChartType;
  options: ChartOptions;
  data: ChartData;
}
