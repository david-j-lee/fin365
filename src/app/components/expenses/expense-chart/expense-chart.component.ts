import { Component, inject } from '@angular/core'
import { barOptions } from '@constants/chart.constants'
import { colorPalettes } from '@constants/color.constants'
import { ChartExpense } from '@interfaces/chart-expense.interface'
import { FinanceService } from '@services/finance.service'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-expense-chart',
  templateUrl: 'expense-chart.component.html',
  imports: [BaseChartDirective],
})
export class ExpenseChartComponent {
  private financeService = inject(FinanceService)

  chartExpense: ChartExpense = {
    chartType: 'bar',
    options: barOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...colorPalettes.expense,
        },
      ],
    },
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

    this.financeService.budget
      .expenses()
      .toSorted((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((expense) => {
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
