import { Component } from '@angular/core';

import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'app-expense-pie-chart',
  templateUrl: 'expense-pie-chart.component.html',
  styleUrls: ['expense-pie-chart.component.scss'],
})
export class ExpensePieChartComponent {
  constructor(public chartService: ChartService) {}
}
