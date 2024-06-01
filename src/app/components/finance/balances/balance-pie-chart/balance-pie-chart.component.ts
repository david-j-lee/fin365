import { CurrencyPipe, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-balance-pie-chart',
  templateUrl: 'balance-pie-chart.component.html',
  styleUrls: ['balance-pie-chart.component.scss'],
  standalone: true,
  imports: [NgIf, BaseChartDirective, CurrencyPipe],
})
export class BalancePieChartComponent {
  constructor(public chartService: ChartService) {}
}
