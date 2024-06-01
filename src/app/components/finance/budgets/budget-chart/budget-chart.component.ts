import { NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-budget-chart',
  templateUrl: 'budget-chart.component.html',
  styleUrls: ['budget-chart.component.scss'],
  standalone: true,
  imports: [NgIf, BaseChartDirective],
})
export class BudgetChartComponent {
  constructor(public chartService: ChartService) {}
}
