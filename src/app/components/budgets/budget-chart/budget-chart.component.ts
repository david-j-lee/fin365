import { Component, inject } from '@angular/core'
import { ChartBudget } from '@interfaces/chart-budget.interface'
import { FinanceService } from '@services/finance.service'
import { colorPalettes } from '@utilities/constants'
import { format } from 'date-fns'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-budget-chart',
  templateUrl: 'budget-chart.component.html',
  styleUrls: ['budget-chart.component.scss'],
  imports: [BaseChartDirective],
})
export class BudgetChartComponent {
  private financeService = inject(FinanceService)

  chartBudget: ChartBudget = {
    chartType: 'line',
    options: {
      animation: { duration: 0 },
      responsive: true,
      maintainAspectRatio: false,
      elements: { point: { radius: 0 } },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: true, position: 'top' },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          label: 'Balance',
          data: [],
          ...colorPalettes.balances,
        },
        {
          label: 'Revenue',
          data: [],
          ...colorPalettes.revenues,
        },
        {
          label: 'Expense',
          data: [],
          ...colorPalettes.expenses,
        },
      ],
    },
  }

  constructor() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget') {
        this.setChartBudget()
      }
    })
  }

  setChartBudget() {
    if (!this.financeService.budget?.days) {
      return
    }

    const labels: string[] = []
    const datasets = [...this.chartBudget.data.datasets]

    datasets[0].data = []
    datasets[1].data = []
    datasets[2].data = []

    this.financeService.budget.days().forEach((day) => {
      labels.push(format(day.date, 'M/d'))
      datasets[0].data.push(day.balance)
      datasets[1].data.push(day.total.revenue)
      datasets[2].data.push(-day.total.expense)
    })
    this.chartBudget.data = {
      ...this.chartBudget.data,
      labels,
      datasets,
    }
  }
}
