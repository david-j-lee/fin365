import { FinanceService } from './finance.service'
import { Injectable } from '@angular/core'
import { Balance } from '@interfaces/balances/balance.interface'
import { Budget } from '@interfaces/budgets/budget.interface'
import { DailyBalance } from '@interfaces/daily/daily-balance.interface'
import { DailyExpense } from '@interfaces/daily/daily-expense.interface'
import { DailyRevenue } from '@interfaces/daily/daily-revenue.interface'
import { Day } from '@interfaces/daily/day.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import moment, { Moment } from 'moment'

@Injectable()
export class DailyService {
  todaysEstimatedBalance = 0
  startDate: Moment = moment()
  endDate: Moment = moment()
  numberOfDays = 365
  budget: Budget = {} as Budget

  constructor(private financeService: FinanceService) {
    // Inject services
  }

  getBalanceForGivenDay(date: string) {
    if (
      !this.financeService.selectedBudget ||
      !this.financeService.selectedBudget.days
    ) {
      return 0
    }

    const day = this.financeService.selectedBudget.days.find(
      (budgetDay) => budgetDay.date.format('MM/DD/YYYY') === date,
    )

    return day?.balance ?? 0
  }

  getTotalRevenue(revenue: Revenue): number {
    return revenue.dailyRevenues
      ? revenue.dailyRevenues.reduce((sum, item) => sum + item.amount, 0)
      : 0
  }

  getTotalExpense(expense: Expense): number {
    return expense.dailyExpenses
      ? expense.dailyExpenses.reduce((sum, item) => sum + item.amount, 0)
      : 0
  }

  resetDailyBudget() {
    this.budget.expenses?.forEach((expense) => {
      expense.dailyExpenses = []
    })
    this.budget.revenues?.forEach((revenue) => {
      revenue.dailyRevenues = []
    })
  }

  generateDailyBudget() {
    if (
      this.financeService.selectedBudget &&
      this.financeService.selectedBudget.startDate
    ) {
      this.budget = this.financeService.selectedBudget
      this.startDate = this.financeService.selectedBudget.startDate.clone()
      this.endDate = this.startDate.clone().add(this.numberOfDays, 'days')

      this.resetDailyBudget()

      this.generateDays()
      this.generateBalances()
      this.generateRevenues()
      this.generateExpenses()

      this.setRunningTotals()
    }
  }

  setRunningTotals() {
    let lastBalance = 0
    this.budget.days?.forEach((day) => {
      day.balance =
        lastBalance + day.totalBalance + day.totalRevenue - day.totalExpense
      lastBalance = day.balance
      if (day.date.format('L') === moment().format('L')) {
        this.todaysEstimatedBalance = day.balance
      }
    })
  }

  generateBalance(balance: Balance) {
    if (this.budget.days) {
      const [firstDay] = this.budget.days
      const dailyBalance: DailyBalance = {
        day: firstDay,
        balance,
        amount: balance.amount,
      }
      firstDay.dailyBalances.push(dailyBalance)
      firstDay.totalBalance += dailyBalance.amount
    }
  }

  generateRevenue(revenue: Revenue) {
    switch (revenue.frequency) {
      case 'Once':
        this.generateOnceRevenue(revenue)
        break
      case 'Daily':
        this.generateDailyRevenue(revenue)
        break
      case 'Weekly':
        this.generateWeeksRevenue(revenue, 1)
        break
      case 'Bi-Weekly':
        this.generateWeeksRevenue(revenue, 2)
        break
      case 'Monthly':
        this.generateMonthsRevenue(revenue, 1)
        break
      case 'Yearly':
        this.generateMonthsRevenue(revenue, 12)
        break
      default:
        console.error(`Encountered unknown frequency ${revenue.frequency}`)
        break
    }
  }

  generateExpense(expense: Expense) {
    switch (expense.frequency) {
      case 'Once':
        this.generateOnceExpense(expense)
        break
      case 'Daily':
        this.generateDailyExpense(expense)
        break
      case 'Weekly':
        this.generateWeeksExpense(expense, 1)
        break
      case 'Bi-Weekly':
        this.generateWeeksExpense(expense, 2)
        break
      case 'Monthly':
        this.generateMonthsExpense(expense, 1)
        break
      case 'Yearly':
        this.generateMonthsExpense(expense, 12)
        break
      default:
        console.error(`Encountered unknown frequency ${expense.frequency}`)
        break
    }
  }

  deleteBalance(balance: Balance) {
    this.budget.days?.forEach((day) => {
      day.dailyBalances = day.dailyBalances.filter(
        (dailyBalance) => dailyBalance.balance !== balance,
      )
      day.totalBalance = day.dailyBalances.reduce(
        (sum, item) => sum + item.amount,
        0,
      )
    })
  }

  deleteRevenue(revenue: Revenue) {
    revenue.dailyRevenues = []
    this.budget.days?.forEach((day) => {
      day.dailyRevenues = day.dailyRevenues.filter(
        (dailyRevenue) => dailyRevenue.revenue !== revenue,
      )
      day.totalRevenue = day.dailyRevenues.reduce(
        (sum, item) => sum + item.amount,
        0,
      )
    })
  }

  deleteExpense(expense: Expense) {
    expense.dailyExpenses = []
    this.budget.days?.forEach((day) => {
      day.dailyExpenses = day.dailyExpenses.filter(
        (dailyExpense) => dailyExpense.expense !== expense,
      )
      day.totalExpense = day.dailyExpenses.reduce(
        (sum, item) => sum + item.amount,
        0,
      )
    })
  }

  private generateDays() {
    this.budget.days = []

    for (let i = 0; i < this.numberOfDays; i++) {
      const date = this.startDate.clone().add(i, 'days')
      const day: Day = {
        date,
        month: date.month(),
        year: date.year(),
        dailyBalances: [],
        dailyExpenses: [],
        dailyRevenues: [],
        totalBalance: 0,
        totalRevenue: 0,
        totalExpense: 0,
        balance: 0,
      }
      this.budget.days.push(day)
    }
  }

  generateBalances() {
    this.budget.balances?.forEach((balance) => {
      this.generateBalance(balance)
    })
  }

  private generateRevenues() {
    this.budget.revenues?.forEach((revenue) => {
      this.generateRevenue(revenue)
    })
  }

  private generateExpenses() {
    this.budget.expenses?.forEach((expense) => {
      this.generateExpense(expense)
    })
  }

  private generateOnceRevenue(revenue: Revenue) {
    if (this.financeService.selectedBudget) {
      const day = this.financeService.selectedBudget.days?.find(
        (budgetDay) =>
          budgetDay.date.format('L') === revenue.startDate?.format('L'),
      )
      if (day) {
        const dailyRevenue: DailyRevenue = {
          day,
          revenue,
          amount: revenue.amount,
        }
        day.dailyRevenues.push(dailyRevenue)
        day.totalRevenue += dailyRevenue.amount
        if (!revenue.dailyRevenues) {
          revenue.dailyRevenues = []
        }
        revenue.dailyRevenues.push(dailyRevenue)
      }
    }
  }

  private generateOnceExpense(expense: Expense) {
    if (this.financeService.selectedBudget) {
      const day = this.financeService.selectedBudget.days?.find(
        (budgetDay) =>
          budgetDay.date.format('L') === expense.startDate?.format('L'),
      )
      if (day) {
        const dailyExpense: DailyExpense = {
          day,
          expense,
          amount: expense.amount,
        }
        day.dailyExpenses.push(dailyExpense)
        day.totalExpense += dailyExpense.amount
        if (!expense.dailyExpenses) {
          expense.dailyExpenses = []
        }
        expense.dailyExpenses.push(dailyExpense)
      }
    }
  }

  private generateDailyRevenue(revenue: Revenue) {
    if (!this.budget.days) {
      return
    }

    const minDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever,
    )
    const minDay = this.budget.days.find(
      (day) => day.date.format('L') === minDate.format('L'),
    )
    if (!minDay) {
      return
    }
    const minDayIndex = this.budget.days.indexOf(minDay)
    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever,
    )
    const numLoops = maxDate.diff(minDate, 'days', true)

    for (let i = 0; i < numLoops; i++) {
      const day = this.budget.days[minDayIndex + i]
      if (day) {
        const dailyRevenue: DailyRevenue = {
          day,
          revenue,
          amount: revenue.amount,
        }
        day.dailyRevenues.push(dailyRevenue)
        day.totalRevenue += dailyRevenue.amount
        if (!revenue.dailyRevenues) {
          revenue.dailyRevenues = []
        }
        revenue.dailyRevenues.push(dailyRevenue)
      }
    }
  }

  private generateDailyExpense(expense: Expense) {
    if (!this.budget.days) {
      return
    }

    const minDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever,
    )
    const minDay = this.budget.days.find(
      (day) => day.date.format('L') === minDate.format('L'),
    )
    if (!minDay) {
      return
    }
    const minDayIndex = this.budget.days.indexOf(minDay)
    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever,
    )
    const numLoops = maxDate.diff(minDate, 'days', true)

    for (let i = 0; i < numLoops; i++) {
      const day = this.budget.days[minDayIndex + i]
      if (day) {
        const dailyExpense: DailyExpense = {
          day,
          expense,
          amount: expense.amount,
        }
        day.dailyExpenses.push(dailyExpense)
        day.totalExpense += dailyExpense.amount
        if (!expense.dailyExpenses) {
          expense.dailyExpenses = []
        }
        expense.dailyExpenses.push(dailyExpense)
      }
    }
  }

  private generateWeeksRevenue(revenue: Revenue, byWeeks: number) {
    const skipDays = byWeeks * 7
    const repeatDays = this.dailyRepeatDays(revenue)
    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever,
    )
    const firstDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever,
    )
    const firstDateIndex = this.getFirstDayIndex(firstDate)
    if (firstDateIndex === null) {
      return
    }
    const numLoops = maxDate.diff(firstDate, 'days', true) / skipDays

    for (let i = 0; i < numLoops; i++) {
      repeatDays.forEach((repeatDay) => {
        if (!this.budget.days) {
          return
        }
        const day = this.budget.days[firstDateIndex + i * skipDays + repeatDay]
        if (day) {
          const dailyRevenue: DailyRevenue = {
            day,
            revenue,
            amount: revenue.amount,
          }
          day.dailyRevenues.push(dailyRevenue)
          day.totalRevenue += dailyRevenue.amount
          if (!revenue.dailyRevenues) {
            revenue.dailyRevenues = []
          }
          revenue.dailyRevenues.push(dailyRevenue)
        }
      })
    }
  }

  private generateWeeksExpense(expense: Expense, byWeeks: number) {
    if (!this.budget.days) {
      return
    }

    const skipDays = byWeeks * 7
    const repeatDays = this.dailyRepeatDays(expense)
    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever,
    )
    const firstDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever,
    )
    const firstDateIndex = this.getFirstDayIndex(firstDate)
    if (firstDateIndex === null) {
      return
    }
    const numLoops = maxDate.diff(firstDate, 'days', true) / skipDays

    for (let i = 0; i < numLoops; i++) {
      repeatDays.forEach((repeatDay) => {
        if (!this.budget.days) {
          return
        }
        const day = this.budget.days[firstDateIndex + i * skipDays + repeatDay]
        if (day) {
          const dailyExpense: DailyExpense = {
            day,
            expense,
            amount: expense.amount,
          }
          day.dailyExpenses.push(dailyExpense)
          day.totalExpense += dailyExpense.amount
          if (!expense.dailyExpenses) {
            expense.dailyExpenses = []
          }
          expense.dailyExpenses.push(dailyExpense)
        }
      })
    }
  }

  private generateMonthsRevenue(revenue: Revenue, numMonths: number) {
    if (!this.budget.days) {
      return
    }

    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever,
    )
    const firstDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever,
    )
    const budgetFirstDay = this.budget.days.find(
      (day) => day.date.format('L') === firstDate.format('L'),
    )
    if (!budgetFirstDay) {
      return
    }
    const firstDateIndex = this.budget.days.indexOf(budgetFirstDay)
    const numLoops = Math.ceil(maxDate.diff(firstDate, 'M', true)) / numMonths

    for (let i = 0; i <= numLoops; i++) {
      const date = firstDate.clone().add(i * numMonths, 'M')
      const day =
        this.budget.days[firstDateIndex + date.diff(firstDate, 'days', true)]
      if (day) {
        const dailyRevenue: DailyRevenue = {
          day,
          revenue,
          amount: revenue.amount,
        }
        day.dailyRevenues.push(dailyRevenue)
        day.totalRevenue += dailyRevenue.amount
        if (!revenue.dailyRevenues) {
          revenue.dailyRevenues = []
        }
        revenue.dailyRevenues.push(dailyRevenue)
      }
    }
  }

  private generateMonthsExpense(expense: Expense, numMonths: number) {
    if (!this.budget.days) {
      return
    }

    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever,
    )
    const firstDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever,
    )
    const budgetFirstDay = this.budget.days.find(
      (day) => day.date.format('L') === firstDate.format('L'),
    )
    if (!budgetFirstDay) {
      return
    }
    const firstDateIndex = this.budget.days.indexOf(budgetFirstDay)
    const numLoops = Math.ceil(maxDate.diff(firstDate, 'M', true)) / numMonths

    for (let i = 0; i <= numLoops; i++) {
      const date = firstDate.clone().add(i * numMonths, 'M')
      const day =
        this.budget.days[firstDateIndex + date.diff(firstDate, 'days', true)]
      if (day) {
        const dailyExpense: DailyExpense = {
          day,
          expense,
          amount: expense.amount,
        }
        day.dailyExpenses.push(dailyExpense)
        day.totalExpense += dailyExpense.amount
        if (!expense.dailyExpenses) {
          expense.dailyExpenses = []
        }
        expense.dailyExpenses.push(dailyExpense)
      }
    }
  }

  private dailyRepeatDays(item: Revenue | Expense): number[] {
    const repeatDays: number[] = []
    if (item.repeatSun) {
      repeatDays.push(0)
    }
    if (item.repeatMon) {
      repeatDays.push(1)
    }
    if (item.repeatTue) {
      repeatDays.push(2)
    }
    if (item.repeatWed) {
      repeatDays.push(3)
    }
    if (item.repeatThu) {
      repeatDays.push(4)
    }
    if (item.repeatFri) {
      repeatDays.push(5)
    }
    if (item.repeatSat) {
      repeatDays.push(6)
    }
    return repeatDays
  }

  private getFirstDayIndex(date: Moment) {
    if (!this.budget.days) {
      return null
    }
    const [firstDay] = this.budget.days
    if (date < firstDay.date) {
      return date.diff(firstDay.date, 'd')
    }
    const budgetFirstDay = this.budget.days.find(
      (day) => day.date.format('L') === date.format('L'),
    )
    if (!budgetFirstDay) {
      return null
    }
    return this.budget.days.indexOf(budgetFirstDay)
  }

  private getStartDate(
    budgetStartDate: Moment,
    itemStartDate: Moment | null,
    frequency: string,
    isForever: boolean,
  ): Moment {
    let date = budgetStartDate.clone()

    if (frequency === 'Weekly' || frequency === 'Bi-Weekly') {
      if (isForever) {
        date = date.weekday(0)
      } else if (itemStartDate) {
        date = itemStartDate.clone().weekday(0)
      }
    }

    // If monthly get most recent month
    if (frequency === 'Monthly' && itemStartDate) {
      if (itemStartDate < budgetStartDate) {
        const monthNeeded = Math.ceil(
          budgetStartDate.diff(itemStartDate, 'months', true),
        )
        date = itemStartDate.clone().add(monthNeeded, 'M')
      } else {
        date = itemStartDate.clone()
      }
    }

    // If yearly get most recent year
    if (frequency === 'Yearly' && itemStartDate) {
      if (itemStartDate < budgetStartDate) {
        const yearsNeeded = Math.ceil(
          budgetStartDate.diff(itemStartDate, 'years', true),
        )
        date = itemStartDate.clone().add(yearsNeeded, 'year')
      } else {
        date = itemStartDate.clone()
      }
    }

    return date
  }

  private getEndDate(
    budgetEndDate: Moment,
    itemEndDate: Moment | null,
    isForever: boolean,
  ): Moment {
    let date = budgetEndDate.clone()
    if (!isForever && itemEndDate && itemEndDate <= budgetEndDate) {
      date = itemEndDate
    }
    return date
  }
}
