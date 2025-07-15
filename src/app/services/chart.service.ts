import { FinanceService } from './finance.service'
import { Injectable, inject } from '@angular/core'
import { ChartBalance } from '@interfaces/chart-balance.interface'
import { ChartBudget } from '@interfaces/chart-budget.interface'
import { ChartExpense } from '@interfaces/chart-expense.interface'
import { ChartRevenue } from '@interfaces/chart-revenue.interface'
import { colorPalettes, pieOptions } from '@utilities/constants'
import { format } from 'date-fns'

@Injectable()
export class ChartService {
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
      if (event.resource === 'budget' || event.resource === 'balance') {
        this.setChartBalance()
      }
      if (event.resource === 'budget' || event.resource === 'revenue') {
        this.setChartRevenue()
      }
      if (event.resource === 'budget' || event.resource === 'expense') {
        this.setChartExpense()
      }
      this.setChartBudget()
    })
  }

  setChartBalance() {
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

  setChartRevenue() {
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

  setChartExpense() {
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
