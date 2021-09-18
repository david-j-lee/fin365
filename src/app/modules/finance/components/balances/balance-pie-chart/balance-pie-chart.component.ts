import { Component } from '@angular/core';

import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'app-balance-pie-chart',
  templateUrl: 'balance-pie-chart.component.html',
  styleUrls: ['balance-pie-chart.component.scss'],
})
export class BalancePieChartComponent {
  constructor(public chartService: ChartService) {}
}
