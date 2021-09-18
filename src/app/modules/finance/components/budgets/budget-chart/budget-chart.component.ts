import { Component, OnInit } from '@angular/core';

import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'app-budget-chart',
  templateUrl: 'budget-chart.component.html',
  styleUrls: ['budget-chart.component.scss'],
})
export class BudgetChartComponent implements OnInit {
  constructor(public chartService: ChartService) {}

  ngOnInit() {}
}
