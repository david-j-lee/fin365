import { ExpenseChartComponent } from '../expense-chart/expense-chart.component'
import { ExpensePieChartComponent } from '../expense-pie-chart/expense-pie-chart.component'
import { Component, inject } from '@angular/core'
import { MonthlyChartComponent } from '@components/monthly-chart/monthly-chart.component'
import { YearlyHeatMapComponent } from '@components/yearly-heat-map/yearly-heat-map.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-dashboard',
  templateUrl: 'expense-dashboard.component.html',
  imports: [
    ExpensePieChartComponent,
    ExpenseChartComponent,
    YearlyHeatMapComponent,
    MonthlyChartComponent,
  ],
})
export class ExpenseDashboardComponent {
  financeService = inject(FinanceService)
}
