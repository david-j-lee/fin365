import { Component, inject } from '@angular/core'
import { barOptions } from '@constants/chart.constants'
import { colorPalettes } from '@constants/color.constants'
import { ChartBalance } from '@interfaces/chart-balance.interface'
import { FinanceService } from '@services/finance.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-balance-chart',
  templateUrl: 'balance-chart.component.html',
  imports: [BaseChartDirective],
})
export class BalanceChartComponent {
  private financeService = inject(FinanceService)

  chartBalance: ChartBalance = {
    chartType: 'bar',
    options: barOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.balance,
        },
      ],
    },
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

    this.financeService.budget
      .balances()
      .toSorted((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((balance) => {
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
          data: data,
        },
      ],
    }

    this.chartBalance.total = total
  }
}
