import { Component, inject } from '@angular/core'
import { MonthlyChartComponent } from '@components/charts/monthly-chart/monthly-chart.component'
import { PieChartComponent } from '@components/charts/pie-chart/pie-chart.component'
import { SummaryChartComponent } from '@components/charts/summary-chart/summary-chart.component'
import { YearlyHeatMapComponent } from '@components/charts/yearly-heat-map/yearly-heat-map.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-dashboard',
  templateUrl: 'balance-dashboard.component.html',
  imports: [
    SummaryChartComponent,
    PieChartComponent,
    YearlyHeatMapComponent,
    MonthlyChartComponent,
    SummaryChartComponent,
  ],
})
export class BalanceDashboardComponent {
  financeService = inject(FinanceService)
}
