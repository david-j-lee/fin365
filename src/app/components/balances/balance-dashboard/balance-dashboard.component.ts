import { BalanceChartComponent } from '../balance-chart/balance-chart.component'
import { BalancePieChartComponent } from '../balance-pie-chart/balance-pie-chart.component'
import { Component, inject } from '@angular/core'
import { MonthlyChartComponent } from '@components/monthly-chart/monthly-chart.component'
import { YearlyHeatMapComponent } from '@components/yearly-heat-map/yearly-heat-map.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-dashboard',
  templateUrl: 'balance-dashboard.component.html',
  imports: [
    BalancePieChartComponent,
    BalanceChartComponent,
    YearlyHeatMapComponent,
    MonthlyChartComponent,
  ],
})
export class BalanceDashboardComponent {
  financeService = inject(FinanceService)
}
