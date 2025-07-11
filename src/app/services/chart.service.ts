import { DailyService } from './daily.service'
import { FinanceService } from './finance.service'
import { Injectable, inject } from '@angular/core'
import { ChartBalance } from '@interfaces/charts/chart-balance.interface'
import { ChartBudget } from '@interfaces/charts/chart-budget.interface'
import { ChartExpense } from '@interfaces/charts/chart-expense.interface'
import { ChartRevenue } from '@interfaces/charts/chart-revenue.interface'

@Injectable()
export class ChartService {
  private financeService = inject(FinanceService)
  private dailyService = inject(DailyService)

  pieOptions = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  }

  balanceColorLightest = 'rgba(54, 162, 235, 0.2)'
  balanceColorLight = 'rgba(54, 162, 235, 0.8)'
  balanceColorNormal = 'rgba(54, 162, 235, 1)'

  revenueColorLightest = 'rgba(75, 192, 192, 0.2)'
  revenueColorLight = 'rgba(75, 192, 192, 0.8)'
  revenueColorNormal = 'rgba(75, 192, 192, 1)'

  expenseColorLightest = 'rgba(255, 99, 132, 0.2)'
  expenseColorLight = 'rgba(255, 99, 132, 0.8)'
  expenseColorNormal = 'rgba(255, 99, 132, 1)'

  colorPalettes = {
    balances: {
      // Balances
      color: this.balanceColorNormal,
      backgroundColor: this.balanceColorLightest,
      hoverBackgroundColor: this.balanceColorLight,
      borderColor: this.balanceColorNormal,
      hoverBorderColor: this.balanceColorNormal,
      pointBackgroundColor: this.balanceColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.balanceColorLight,
    },
    revenues: {
      // Revenues
      color: this.revenueColorNormal,
      backgroundColor: this.revenueColorLightest,
      hoverBackgroundColor: this.revenueColorLight,
      borderColor: this.revenueColorNormal,
      hoverBorderColor: this.revenueColorNormal,
      pointBackgroundColor: this.revenueColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.revenueColorLight,
    },
    expenses: {
      // Expenses
      color: this.expenseColorNormal,
      backgroundColor: this.expenseColorLightest,
      hoverBackgroundColor: this.expenseColorLight,
      borderColor: this.expenseColorNormal,
      hoverBorderColor: this.expenseColorNormal,
      pointBackgroundColor: this.expenseColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.expenseColorLight,
    },
  }

  chartBalance: ChartBalance = {
    chartType: 'doughnut',
    options: this.pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...this.colorPalettes.balances,
        },
      ],
    },
    total: 0,
  }

  chartRevenue: ChartRevenue = {
    chartType: 'doughnut',
    options: this.pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...this.colorPalettes.revenues,
        },
      ],
    },
    total: 0,
  }

  chartExpense: ChartExpense = {
    chartType: 'doughnut',
    options: this.pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ...this.colorPalettes.expenses,
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
          ...this.colorPalettes.balances,
        },
        {
          label: 'Revenue',
          data: [],
          ...this.colorPalettes.revenues,
        },
        {
          label: 'Expense',
          data: [],
          ...this.colorPalettes.expenses,
        },
      ],
    },
  }

  setChartBalance() {
    if (this.financeService.selectedBudget?.balances) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.selectedBudget.balances.forEach((balance) => {
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
    if (this.financeService.selectedBudget?.revenues) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.selectedBudget.revenues.forEach((revenue) => {
        revenue.yearlyAmount = this.dailyService.getTotalRevenue(revenue)
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
    if (this.financeService.selectedBudget?.expenses) {
      let total = 0

      const data: number[] = []
      const labels: string[] = []
      this.financeService.selectedBudget.expenses.forEach((expense) => {
        expense.yearlyAmount = this.dailyService.getTotalExpense(expense)
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
    if (this.financeService.selectedBudget?.days) {
      const labels: string[] = []
      const datasets = [...this.chartBudget.data.datasets]

      datasets[0].data = []
      datasets[1].data = []
      datasets[2].data = []

      this.financeService.selectedBudget.days.forEach((day) => {
        labels.push(day.date.format('M/D'))
        datasets[0].data.push(day.balance)
        datasets[1].data.push(day.totalRevenue)
        datasets[2].data.push(-day.totalExpense)
      })

      this.chartBudget.data = {
        ...this.chartBudget.data,
        labels,
        datasets,
      }
    }
  }
}
