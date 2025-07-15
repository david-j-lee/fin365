import { CurrencyPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ChartExpense } from '@interfaces/chart-expense.interface'
import { FinanceService } from '@services/finance.service'
import { colorPalettes, pieOptions } from '@utilities/constants'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-expense-pie-chart',
  templateUrl: 'expense-pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class ExpensePieChartComponent {
  private financeService = inject(FinanceService)

  chartExpense: ChartExpense = {
    chartType: 'doughnut',
    options: pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.expenses,
        },
      ],
    },
    total: 0,
  }

  constructor() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === 'expense') {
        this.setChartExpense()
      }
    })
  }

  private setChartExpense() {
    if (!this.financeService.budget?.expenses) {
      return
    }

    let total = 0
    const data: number[] = []
    const labels: string[] = []

    this.financeService.budget.expenses().forEach((expense) => {
      data.push(expense.yearlyAmount)
      labels.push(expense.description)
      total += expense.yearlyAmount
    })
    this.chartExpense.data = {
      ...this.chartExpense,
      labels,
      datasets: [
        {
          ...this.chartExpense.data.datasets[0],
          data,
        },
      ],
    }
    this.chartExpense.total = total
  }
}
