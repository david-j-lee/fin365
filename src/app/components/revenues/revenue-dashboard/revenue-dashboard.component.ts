import { RevenueChartComponent } from '../revenue-chart/revenue-chart.component'
import { RevenuePieChartComponent } from '../revenue-pie-chart/revenue-pie-chart.component'
import { Component, inject } from '@angular/core'
import { MonthlyChartComponent } from '@components/monthly-chart/monthly-chart.component'
import { YearlyHeatMapComponent } from '@components/yearly-heat-map/yearly-heat-map.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-revenue-dashboard',
  templateUrl: 'revenue-dashboard.component.html',
  imports: [
    MonthlyChartComponent,
    RevenuePieChartComponent,
    RevenueChartComponent,
    YearlyHeatMapComponent,
  ],
})
export class RevenueDashboardComponent {
  financeService = inject(FinanceService)
}
