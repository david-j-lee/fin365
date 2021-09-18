import { ChartData, ChartOptions, ChartType, Color } from 'chart.js';

export interface ChartBalance {
  chartType: ChartType;
  options: ChartOptions;
  data: ChartData;
  total: number;
}
