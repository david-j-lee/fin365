import { Component, inject } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-budget-chart',
  templateUrl: 'budget-chart.component.html',
  styleUrls: ['budget-chart.component.scss'],
  imports: [BaseChartDirective],
})
export class BudgetChartComponent {
  chartService = inject(ChartService)
}
