import { CurrencyPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-balance-pie-chart',
  templateUrl: 'balance-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class BalancePieChartComponent {
  chartService = inject(ChartService)
}
