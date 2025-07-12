import { Injectable } from '@angular/core'
import { Budget } from '@interfaces/budgets/budget.interface'
import { Day } from '@interfaces/daily/day.interface'
import { Event } from '@interfaces/events/event.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import { Rule, RuleType } from '@interfaces/rules/rule.interface'
import {
  addDailyItem,
  getRuleRange,
  getRuleRepeatDays,
  getRuleTotal,
} from '@utilities/rule-utilities'
import moment from 'moment'
import { Moment } from 'moment'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FinanceService {
  events = new Subject<Event>()

  budgets: Budget[] | null = null
  budget: Budget | null = null
  isLoaded = false

  todaysEstimatedBalance = 0
  startDate: Moment = moment()
  endDate: Moment = moment()
  numberOfDays = 365
  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly']

  selectBudget(budget: Budget | null) {
    this.budget = budget
  }

  getFirstDate() {
    return this.budget?.days ? this.budget?.days[0]?.date : null
  }

  getMostRecentSnapshotDate() {
    if (!this.budget?.snapshots || this.budget.snapshots.length === 0) {
      return null
    }

    return this.budget.snapshots[0].date
  }

  getBalanceOn(date: string) {
    if (!this.budget || !this.budget.days) {
      return 0
    }

    const day = this.budget.days.find(
      (budgetDay) => budgetDay.date.format('MM/DD/YYYY') === date,
    )

    return day?.balance ?? 0
  }

  addRule(rule: Rule) {
    this.generateDataForRule(rule)
    this.updateRunningTotals()
    this.events.next({ event: 'add', rule: rule })
  }

  updateRule(rule: Rule) {
    this.deleteRule(rule)
    this.generateDataForRule(rule)
    this.updateRunningTotals()
    this.events.next({ event: 'update', rule: rule })
  }

  deleteRule(rule: Rule) {
    rule.daily = []

    this.budget?.days?.forEach((day) => {
      day.daily[rule.type] = day.daily[rule.type].filter(
        (dailyRevenue) => dailyRevenue.rule !== rule,
      )
      day.total[rule.type] = day.daily[rule.type].reduce(
        (sum, item) => sum + item.amount,
        0,
      )
    })

    this.updateRunningTotals()
    this.events.next({ event: 'delete', rule: rule })
  }

  generateBudget() {
    if (!this.budget || !this.budget.startDate) {
      return
    }

    this.startDate = this.budget.startDate.clone()
    this.endDate = this.startDate.clone().add(this.numberOfDays, 'days')

    this.resetDailyData()
    this.generateDaysOnBudget()
    this.generateDataForRules('balance')
    this.generateDataForRules('revenue')
    this.generateDataForRules('expense')
    this.updateRunningTotals()
  }

  private resetDailyData() {
    this.budget?.balances?.forEach((balance) => {
      balance.daily = []
    })
    this.budget?.expenses?.forEach((expense) => {
      expense.daily = []
    })
    this.budget?.revenues?.forEach((revenue) => {
      revenue.daily = []
    })
  }

  private updateRunningTotals() {
    if (!this.budget?.days) {
      return
    }

    let lastBalance = 0

    for (const day of this.budget.days) {
      day.balance =
        lastBalance + day.total.balance + day.total.revenue - day.total.expense
      lastBalance = day.balance

      if (day.date.format('L') === moment().format('L')) {
        this.todaysEstimatedBalance = day.balance
      }
    }
  }

  private generateDaysOnBudget() {
    if (!this.budget) {
      return
    }

    this.budget.days = []

    for (let i = 0; i < this.numberOfDays; i++) {
      const date = this.startDate.clone().add(i, 'days')
      const day: Day = {
        date,
        month: date.month(),
        year: date.year(),
        daily: {
          balance: [],
          revenue: [],
          expense: [],
          savings: [],
        },
        total: {
          balance: 0,
          revenue: 0,
          expense: 0,
          savings: 0,
        },
        balance: 0,
      }
      this.budget?.days.push(day)
    }
  }

  private generateDataForRule(rule: Rule | RepeatableRule) {
    if ('frequency' in rule) {
      switch (rule.frequency) {
        case 'Once':
          this.generateRuleOnce(rule)
          break
        case 'Daily':
          this.generateRuleDaily(rule)
          break
        case 'Weekly':
          this.generateRuleWeeks(rule, 1)
          break
        case 'Bi-Weekly':
          this.generateRuleWeeks(rule, 2)
          break
        case 'Monthly':
          this.generateRuleMonths(rule, 1)
          break
        case 'Yearly':
          this.generateRuleMonths(rule, 12)
          break
        default:
          console.error(`Encountered unknown frequency ${rule.frequency}`)
          break
      }
    } else {
      // If it's a one-time rule, we can just generate it once
      this.generateRuleOnce(rule)
    }

    // Add any meta data or calculated data to the rule
    rule.yearlyAmount = getRuleTotal(rule)
  }

  private generateDataForRules(type: RuleType) {
    const key = `${type}s` as keyof Budget
    const records = this.budget?.[key] as RepeatableRule[] | undefined

    if (!records) {
      return
    }

    records.forEach((rule) => {
      this.generateDataForRule(rule)
    })
  }

  private generateRuleOnce(rule: Rule | RepeatableRule) {
    if (!this.budget) {
      return
    }

    const day =
      'startDate' in rule
        ? this.budget.days?.find(
            (budgetDay) =>
              budgetDay.date.format('L') === rule.startDate?.format('L'),
          )
        : this.budget.days[0]

    if (!day) {
      return
    }

    addDailyItem({
      day,
      rule,
      amount: rule.amount,
    })
  }

  private generateRuleDaily(rule: RepeatableRule) {
    if (!this.budget?.days) {
      return
    }

    const [startDate, endDate] = getRuleRange(
      [this.startDate, this.endDate],
      [rule.startDate, rule.endDate],
      rule.frequency,
      rule.isForever,
    )
    const minDay = this.budget?.days.find(
      (day) => day.date.format('L') === startDate.format('L'),
    )

    if (!minDay) {
      return
    }

    const minDayIndex = this.budget?.days.indexOf(minDay)
    const numLoops = endDate.diff(startDate, 'days', true)

    for (let i = 0; i < numLoops; i++) {
      const day = this.budget?.days[minDayIndex + i]

      if (!day) {
        continue
      }

      addDailyItem({
        day,
        rule,
        amount: rule.amount,
      })
    }
  }

  private generateRuleWeeks(rule: RepeatableRule, byWeeks: number) {
    if (!this.budget?.days) {
      return
    }

    const skipDays = byWeeks * 7
    const repeatDays = getRuleRepeatDays(rule)
    const [startDate, endDate] = getRuleRange(
      [this.startDate, this.endDate],
      [rule.startDate, rule.endDate],
      rule.frequency,
      rule.isForever,
    )
    const firstDateIndex = this.getFirstDayIndex(startDate)

    if (firstDateIndex === null) {
      return
    }

    const numLoops = endDate.diff(startDate, 'days', true) / skipDays

    for (let i = 0; i < numLoops; i++) {
      for (const repeatDay of repeatDays) {
        const day = this.budget?.days[firstDateIndex + i * skipDays + repeatDay]

        if (!day) {
          continue
        }

        addDailyItem({
          day,
          rule,
          amount: rule.amount,
        })
      }
    }
  }

  private generateRuleMonths(rule: RepeatableRule, numMonths: number) {
    if (!this.budget?.days) {
      return
    }

    const [firstDate, maxDate] = getRuleRange(
      [this.startDate, this.endDate],
      [rule.startDate, rule.endDate],
      rule.frequency,
      rule.isForever,
    )
    const budgetFirstDay = this.budget?.days.find(
      (day) => day.date.format('L') === firstDate.format('L'),
    )

    if (!budgetFirstDay) {
      return
    }

    const firstDateIndex = this.budget?.days.indexOf(budgetFirstDay)
    const numLoops = Math.ceil(maxDate.diff(firstDate, 'M', true)) / numMonths

    for (let i = 0; i <= numLoops; i++) {
      const date = firstDate.clone().add(i * numMonths, 'M')
      const day =
        this.budget?.days[firstDateIndex + date.diff(firstDate, 'days', true)]

      if (!day) {
        continue
      }

      addDailyItem({
        day,
        rule,
        amount: rule.amount,
      })
    }
  }

  private getFirstDayIndex(date: Moment) {
    if (!this.budget?.days) {
      return null
    }

    const [firstDay] = this.budget.days

    if (date < firstDay.date) {
      return date.diff(firstDay.date, 'd')
    }

    const budgetFirstDay = this.budget?.days.find(
      (day) => day.date.format('L') === date.format('L'),
    )

    if (!budgetFirstDay) {
      return null
    }

    return this.budget?.days.indexOf(budgetFirstDay)
  }
}
