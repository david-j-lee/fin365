import { Component, inject } from '@angular/core'
import { MonthlyChartComponent } from '@components/charts/monthly-chart/monthly-chart.component'
import { PieChartComponent } from '@components/charts/pie-chart/pie-chart.component'
import { SummaryChartComponent } from '@components/charts/summary-chart/summary-chart.component'
import { YearlyHeatMapComponent } from '@components/charts/yearly-heat-map/yearly-heat-map.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-dashboard',
  templateUrl: 'expense-dashboard.component.html',
  imports: [
    PieChartComponent,
    YearlyHeatMapComponent,
    MonthlyChartComponent,
    SummaryChartComponent,
  ],
})
export class ExpenseDashboardComponent {
  financeService = inject(FinanceService)
}
