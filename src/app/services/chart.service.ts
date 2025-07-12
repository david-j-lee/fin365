import { FinanceService } from './finance.service'
import { Injectable, inject } from '@angular/core'
import { ChartBalance } from '@interfaces/chart-balance.interface'
import { ChartBudget } from '@interfaces/chart-budget.interface'
import { ChartExpense } from '@interfaces/chart-expense.interface'
import { ChartRevenue } from '@interfaces/chart-revenue.interface'
import { getRuleTotal } from '@utilities/rule-utilities'

const pieOptions = {
  animation: { duration: 0 },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
}

const balanceColors = {
  Lightest: 'rgba(54, 162, 235, 0.2)',
  Light: 'rgba(54, 162, 235, 0.8)',
  Normal: 'rgba(54, 162, 235, 1)',
}

const revenueColors = {
  Lightest: 'rgba(75, 192, 192, 0.2)',
  Light: 'rgba(75, 192, 192, 0.8)',
  Normal: 'rgba(75, 192, 192, 1)',
}

const expenseColors = {
  Lightest: 'rgba(255, 99, 132, 0.2)',
  Light: 'rgba(255, 99, 132, 0.8)',
  Normal: 'rgba(255, 99, 132, 1)',
}

const colorPalettes = {
  balances: {
    // Balances
    color: balanceColors.Normal,
    backgroundColor: balanceColors.Lightest,
    hoverBackgroundColor: balanceColors.Light,
    borderColor: balanceColors.Normal,
    hoverBorderColor: balanceColors.Normal,
    pointBackgroundColor: balanceColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: balanceColors.Light,
  },
  revenues: {
    // Revenues
    color: revenueColors.Normal,
    backgroundColor: revenueColors.Lightest,
    hoverBackgroundColor: revenueColors.Light,
    borderColor: revenueColors.Normal,
    hoverBorderColor: revenueColors.Normal,
    pointBackgroundColor: revenueColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: revenueColors.Light,
  },
  expenses: {
    // Expenses
    color: expenseColors.Normal,
    backgroundColor: expenseColors.Lightest,
    hoverBackgroundColor: expenseColors.Light,
    borderColor: expenseColors.Normal,
    hoverBorderColor: expenseColors.Normal,
    pointBackgroundColor: expenseColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: expenseColors.Light,
  },
}

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
    if (this.financeService.budget?.balances) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.budget.balances.forEach((balance) => {
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

  setChartRevenue() {
    if (this.financeService.budget?.revenues) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.budget.revenues.forEach((revenue) => {
        revenue.yearlyAmount = getRuleTotal(revenue)
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

  setChartExpense() {
    if (this.financeService.budget?.expenses) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.budget.expenses.forEach((expense) => {
        expense.yearlyAmount = getRuleTotal(expense)
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

  setChartBudget() {
    if (this.financeService.budget?.days) {
      const labels: string[] = []
      const datasets = [...this.chartBudget.data.datasets]

      datasets[0].data = []
      datasets[1].data = []
      datasets[2].data = []

      this.financeService.budget.days.forEach((day) => {
        labels.push(day.date.format('M/D'))
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
}
