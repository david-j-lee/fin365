import { CurrencyPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-revenue-pie-chart',
  templateUrl: 'revenue-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class RevenuePieChartComponent {
  chartService = inject(ChartService)
}
