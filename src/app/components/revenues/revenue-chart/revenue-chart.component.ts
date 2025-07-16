import { Component, inject } from '@angular/core'
import { barOptions } from '@constants/chart.constants'
import { colorPalettes } from '@constants/color.constants'
import { ChartRevenue } from '@interfaces/chart-revenue.interface'
import { FinanceService } from '@services/finance.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-revenue-chart',
  templateUrl: 'revenue-chart.component.html',
  imports: [BaseChartDirective],
})
export class RevenueChartComponent {
  private financeService = inject(FinanceService)

  chartRevenue: ChartRevenue = {
    chartType: 'bar',
    options: barOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.revenue,
        },
      ],
    },
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

    this.financeService.budget
      .revenues()
      .toSorted((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((revenue) => {
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
