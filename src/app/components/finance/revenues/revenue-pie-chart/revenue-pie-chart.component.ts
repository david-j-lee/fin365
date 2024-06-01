import { CurrencyPipe, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { ChartService } from '@services/chart.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-revenue-pie-chart',
  templateUrl: 'revenue-pie-chart.component.html',
  styleUrls: ['revenue-pie-chart.component.scss'],
  standalone: true,
  imports: [NgIf, BaseChartDirective, CurrencyPipe],
})
export class RevenuePieChartComponent {
  constructor(public chartService: ChartService) {}
}
