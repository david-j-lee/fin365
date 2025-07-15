import { BalancePieChartComponent } from '../balance-pie-chart/balance-pie-chart.component'
import { Component, inject } from '@angular/core'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-dashboard',
  templateUrl: 'balance-dashboard.component.html',
  imports: [BalancePieChartComponent],
})
export class BalanceDashboardComponent {
  financeService = inject(FinanceService)
}
