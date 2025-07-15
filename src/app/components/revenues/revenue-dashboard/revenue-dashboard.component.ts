import { RevenuePieChartComponent } from '../revenue-pie-chart/revenue-pie-chart.component'
import { Component, inject } from '@angular/core'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-revenue-dashboard',
  templateUrl: 'revenue-dashboard.component.html',
  imports: [RevenuePieChartComponent],
})
export class RevenueDashboardComponent {
  financeService = inject(FinanceService)
}
