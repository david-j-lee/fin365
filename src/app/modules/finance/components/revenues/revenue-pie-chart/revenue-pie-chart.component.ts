import { Component } from '@angular/core';

import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'app-revenue-pie-chart',
  templateUrl: 'revenue-pie-chart.component.html',
  styleUrls: ['revenue-pie-chart.component.scss'],
})
export class RevenuePieChartComponent {
  constructor(public chartService: ChartService) {}
}
