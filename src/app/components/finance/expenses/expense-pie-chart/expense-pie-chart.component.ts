import { CurrencyPipe, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-expense-pie-chart',
  templateUrl: 'expense-pie-chart.component.html',
  styleUrls: ['expense-pie-chart.component.scss'],
  standalone: true,
  imports: [NgIf, BaseChartDirective, CurrencyPipe],
})
export class ExpensePieChartComponent {
  constructor(public chartService: ChartService) {}
}
