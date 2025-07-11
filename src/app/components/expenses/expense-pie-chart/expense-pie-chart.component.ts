import { CurrencyPipe } from '@angular/common'
import { Component } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-expense-pie-chart',
  templateUrl: 'expense-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class ExpensePieChartComponent {
  constructor(public chartService: ChartService) {
    // Inject
  }
}
