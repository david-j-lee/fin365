import { CurrencyPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartBalance } from '@interfaces/chart-balance.interface'
import { FinanceService } from '@services/finance.service'
import { colorPalettes, pieOptions } from '@utilities/constants'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-balance-pie-chart',
  templateUrl: 'balance-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class BalancePieChartComponent {
  private financeService = inject(FinanceService)

  chartBalance: ChartBalance = {
    chartType: 'doughnut',
    options: pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.balances,
        },
      ],
    },
    total: 0,
  }

  constructor() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === 'balance') {
        this.setChartBalance()
      }
    })
  }

  private setChartBalance() {
    if (!this.financeService.budget?.balances) {
      return
    }

    let total = 0
    const data: number[] = []
    const labels: string[] = []

    this.financeService.budget.balances().forEach((balance) => {
      data.push(balance.amount)
      labels.push(balance.description)
      total += balance.amount
    })
    this.chartBalance.data = {
      ...this.chartBalance.data,
      labels,
      datasets: [
        {
          ...this.chartBalance.data.datasets[0],
          data,
        },
      ],
    }
    this.chartBalance.total = total
  }
}
