import { CurrencyPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartRevenue } from '@interfaces/chart-revenue.interface'
import { FinanceService } from '@services/finance.service'
import { colorPalettes, pieOptions } from '@utilities/constants'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-revenue-pie-chart',
  templateUrl: 'revenue-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class RevenuePieChartComponent {
  private financeService = inject(FinanceService)

  chartRevenue: ChartRevenue = {
    chartType: 'doughnut',
    options: pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.revenues,
        },
      ],
    },
    total: 0,
  }

  constructor() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === 'revenue') {
        this.setChartRevenue()
      }
    })
  }

  private setChartRevenue() {
    if (!this.financeService.budget?.revenues) {
      return
    }

    let total = 0
    const data: number[] = []
    const labels: string[] = []

    this.financeService.budget.revenues().forEach((revenue) => {
      data.push(revenue.yearlyAmount)
      labels.push(revenue.description)
      total += revenue.yearlyAmount
    })
    this.chartRevenue.data = {
      ...this.chartRevenue.data,
      labels,
      datasets: [
        {
          ...this.chartRevenue.data.datasets[0],
          data,
        },
      ],
    }
    this.chartRevenue.total = total
  }
}
