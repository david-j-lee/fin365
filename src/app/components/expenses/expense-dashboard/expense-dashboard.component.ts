import { ExpensePieChartComponent } from '../expense-pie-chart/expense-pie-chart.component'
import { Component, inject } from '@angular/core'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-dashboard',
  templateUrl: 'expense-dashboard.component.html',
  imports: [ExpensePieChartComponent],
})
export class ExpenseDashboardComponent {
  financeService = inject(FinanceService)
}
