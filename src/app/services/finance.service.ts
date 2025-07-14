import { Injectable } from '@angular/core'
import { BudgetAccess } from '@data/access/budget.access'
import { RuleRepeatableAccess } from '@data/access/rule-repeatable.access'
import { RuleAccess } from '@data/access/rule.access'
import { SnapshotAccess } from '@data/access/snapshot.access'
import { BudgetAdd } from '@interfaces/budget-add.interface'
import { BudgetEdit } from '@interfaces/budget-edit.interface'
import { Budget } from '@interfaces/budget.interface'
import { Day } from '@interfaces/day.interface'
import { Event } from '@interfaces/event.interface'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import { SnapshotAdd } from '@interfaces/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshot-balance-add.interface'
import {
  addDailyItem,
  getRuleRange,
  getRuleRepeatDays,
  getRuleTotal,
  isRuleRepeatable,
} from '@utilities/rule-utilities'
import {
  addDays,
  addMonths,
  differenceInCalendarMonths,
  differenceInDays,
  getMonth,
  getYear,
  isSameDay,
  isToday,
} from 'date-fns'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private budgetAccess = new BudgetAccess()
  private ruleAccess = new RuleAccess()
  private ruleRepeatableAccess = new RuleRepeatableAccess()
  private snapshotAccess = new SnapshotAccess()

  events = new Subject<Event>()

  budgets: Budget[] | null = null
  budget: Budget | null = null
  isLoaded = false

  todaysEstimatedBalance = 0
  startDate: Date = new Date()
  endDate: Date = new Date()
  numberOfDays = 365
  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly']

  getFirstDate() {
    return this.budget?.days ? this.budget?.days[0]?.date : null
  }

  getMostRecentSnapshotDate() {
    if (!this.budget?.snapshots || this.budget.snapshots.length === 0) {
      return null
    }
    return this.budget.snapshots[0].date
  }

  getBalanceOn(date: Date | null) {
    if (!date || !this.budget || !this.budget.days) {
      return 0
    }
    const day = this.budget.days.find((budgetDay) =>
      isSameDay(budgetDay.date, date),
    )
    return day?.balance ?? 0
  }

  async loadBudgets() {
    this.budgets = await this.budgetAccess.getAll()
    this.isLoaded = true
  }

  async addBudget(budgetAdd: BudgetAdd) {
    // Request the data
    const [budget, snapshot] = await this.budgetAccess.add(budgetAdd)

    // Load the data
    this.budgets?.push(budget)
    this.selectBudget(budget)
    if (this.budget?.snapshots) {
      this.budget.snapshots.push(snapshot)
    }
    this.generateBudget()

    // Send out the add budget event
    this.events.next({ resource: 'budget', event: 'add', budget })
  }

  async selectBudget(budget: Budget | null) {
    this.budget = budget

    if (!budget) {
      return
    }

    if (!budget.isBalancesLoaded) {
      await this.getBalances(budget)
    }
    if (!budget.isExpensesLoaded) {
      await this.getExpenses(budget)
    }
    if (!budget.isRevenuesLoaded) {
      await this.getRevenues(budget)
    }
    if (!budget.isSnapshotsLoaded) {
      await this.getSnapshots(budget)
    }

    this.generateBudget()

    this.events.next({ resource: 'budget', event: 'select', budget })
  }

  async editBudget(budgetOriginal: Budget, budgetEdit: BudgetEdit) {
    return await this.budgetAccess.update(budgetOriginal, budgetEdit)
  }

  async deleteBudget(budget: Budget) {
    if (!this.budgets) {
      return false
    }
    const result = await this.budgetAccess.delete(budget.id)
    if (!result) {
      return false
    }
    const deletedBudget = this.budgets.find((data) => data.id === budget.id)
    if (!deletedBudget) {
      return false
    }
    this.budgets.splice(this.budgets.indexOf(deletedBudget), 1)
    return true
  }

  generateBudget() {
    if (!this.budget || !this.budget.startDate) {
      return
    }

    this.startDate = new Date(this.budget.startDate)
    this.endDate = addDays(this.startDate, this.numberOfDays)

    this.resetDailyData()
    this.generateDaysOnBudget()
    this.generateDataForRules('balance')
    this.generateDataForRules('revenue')
    this.generateDataForRules('expense')
    this.updateRunningTotals()
  }

  async snapshot(addSnapshot: SnapshotAdd, balances: SnapshotBalanceAdd[]) {
    if (!this.budget) {
      return
    }
    const [snapshot, newBalances] = await this.snapshotAccess.save(
      addSnapshot,
      balances,
      this.getBalanceOn(addSnapshot.date),
    )
    this.budget.startDate = snapshot.date
    this.budget.snapshots?.unshift(snapshot)
    this.budget.balances = newBalances
    this.generateBudget()
  }

  async addRule(ruleAdd: RuleAdd | RuleRepeatableAdd) {
    if (!this.budget) {
      return
    }

    // Send request to update the data
    let rule: Rule | RuleRepeatable | null = null
    if (isRuleRepeatable(ruleAdd)) {
      rule = await this.ruleRepeatableAccess.add(ruleAdd)
    } else {
      rule = await this.ruleAccess.add(ruleAdd)
    }

    // Update service state
    const budgetFieldKey = RulesMetadata[ruleAdd.type].budgetFieldKey
    const budgetField = this.budget[budgetFieldKey] as Rule[]
    budgetField.push(rule)
    this.generateDataForRule(rule)
    this.updateRunningTotals()

    // Send out event of the new rule
    this.events.next({ resource: rule.type, event: 'add', rule })
  }

  async editRule(
    ruleOriginal: Rule | RuleRepeatable,
    ruleEdit: RuleEdit | RuleRepeatableEdit,
  ) {
    if (!this.budget) {
      return
    }

    // Send request to update the data
    let rule: Rule | RuleRepeatable | null = null
    if (isRuleRepeatable(ruleOriginal) && isRuleRepeatable(ruleEdit)) {
      rule = await this.ruleRepeatableAccess.update(ruleOriginal, ruleEdit)
    } else {
      rule = await this.ruleAccess.update(ruleOriginal, ruleEdit)
    }

    if (rule == null) {
      // TODO: Better error handling
      return
    }

    // Update service state
    const metadata = RulesMetadata[ruleOriginal.type]
    const ruleArray = this.budget[metadata.budgetFieldKey] as Rule[]
    ;(this.budget[metadata.budgetFieldKey] as Rule[]) = ruleArray.map(
      (record) => (record.id === rule.id ? { ...record, ...rule } : record),
    )
    this.resetRuleCalculatedData(rule)
    this.generateDataForRule(rule)
    this.updateRunningTotals()

    // Send out events for the rule update
    this.events.next({ resource: rule.type, event: 'update', rule })
  }

  async deleteRule(rule: Rule) {
    if (!this.budget) {
      return
    }

    // Send request to delete
    let result = false
    if (isRuleRepeatable(rule)) {
      result = await this.ruleRepeatableAccess.delete(rule)
    } else {
      result = await this.ruleAccess.delete(rule)
    }

    if (!result) {
      // TODO: better error handling
      return
    }

    // Update service state
    const metadata = RulesMetadata[rule.type]
    const budgetField = this.budget[metadata.budgetFieldKey] as Rule[]
    const deletedRecord = budgetField.find((data) => data.id === rule.id)

    if (!deletedRecord) {
      return
    }

    budgetField.splice(budgetField.indexOf(deletedRecord), 1)
    this.resetRuleCalculatedData(rule)

    // Send out delete event
    this.events.next({ resource: rule.type, event: 'delete', rule })
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

  private resetRuleCalculatedData(rule: Rule) {
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

      if (isToday(day.date)) {
        this.todaysEstimatedBalance = day.balance
      }
    }
  }

  private async getBalances(budget: Budget) {
    try {
      const result = await this.ruleAccess.getAll('balance', budget.id)
      budget.balances = result
      budget.isBalancesLoaded = true
    } catch (error) {
      budget.balances = []
      console.error(error)
    }
  }

  private async getExpenses(budget: Budget) {
    try {
      const result = await this.ruleRepeatableAccess.getAll(
        'expense',
        budget.id,
      )
      budget.expenses = result
      budget.isExpensesLoaded = true
    } catch (error) {
      budget.expenses = []
      console.error(error)
    }
  }

  private async getRevenues(budget: Budget) {
    try {
      const result = await this.ruleRepeatableAccess.getAll(
        'revenue',
        budget.id,
      )
      budget.revenues = result
      budget.isRevenuesLoaded = true
    } catch (error) {
      budget.revenues = []
      console.error(error)
    }
  }

  private async getSnapshots(budget: Budget) {
    try {
      const result = await this.snapshotAccess.getAll(budget.id)
      budget.snapshots = result
      if (budget.snapshots && budget.snapshots[0]) {
        budget.startDate = budget.snapshots[0].date
      }
      budget.isSnapshotsLoaded = true
    } catch (error) {
      budget.snapshots = []
      console.error(error)
    }
  }

  private generateDaysOnBudget() {
    if (!this.budget) {
      return
    }

    this.budget.days = []

    for (let i = 0; i < this.numberOfDays; i++) {
      const date = addDays(this.startDate, i)
      const day: Day = {
        date,
        month: getMonth(date),
        year: getYear(date),
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

  private generateDataForRule(rule: Rule | RuleRepeatable) {
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
    const records = this.budget?.[key] as RuleRepeatable[] | undefined

    if (!records) {
      return
    }

    records.forEach((rule) => {
      this.generateDataForRule(rule)
    })
  }

  private generateRuleOnce(rule: Rule | RuleRepeatable) {
    if (!this.budget) {
      return
    }

    const day =
      'startDate' in rule
        ? this.budget.days?.find(
            (budgetDay) =>
              rule.startDate && isSameDay(budgetDay.date, rule.startDate),
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

  private generateRuleDaily(rule: RuleRepeatable) {
    if (!this.budget?.days) {
      return
    }

    const [startDate, endDate] = getRuleRange(
      [this.startDate, this.endDate],
      [rule.startDate, rule.endDate],
      rule.frequency,
      rule.isForever,
    )
    const minDay = this.budget?.days.find((day) =>
      isSameDay(day.date, startDate),
    )

    if (!minDay) {
      return
    }

    const minDayIndex = this.budget?.days.indexOf(minDay)
    const numLoops = differenceInDays(endDate, startDate)

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

  private generateRuleWeeks(rule: RuleRepeatable, byWeeks: number) {
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

    const numLoops = differenceInDays(endDate, startDate) / skipDays

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

  private generateRuleMonths(rule: RuleRepeatable, numMonths: number) {
    if (!this.budget?.days) {
      return
    }

    const [firstDate, maxDate] = getRuleRange(
      [this.startDate, this.endDate],
      [rule.startDate, rule.endDate],
      rule.frequency,
      rule.isForever,
    )
    const budgetFirstDay = this.budget?.days.find((day) =>
      isSameDay(day.date, firstDate),
    )

    if (!budgetFirstDay) {
      return
    }

    const firstDateIndex = this.budget?.days.indexOf(budgetFirstDay)
    const numLoops = differenceInCalendarMonths(maxDate, firstDate) / numMonths

    for (let i = 0; i <= numLoops; i++) {
      const date = addMonths(firstDate, i * numMonths)
      const day =
        this.budget?.days[firstDateIndex + differenceInDays(date, firstDate)]

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

  private getFirstDayIndex(date: Date) {
    if (!this.budget?.days) {
      return null
    }

    const [firstDay] = this.budget.days

    if (date < firstDay.date) {
      return differenceInDays(date, firstDay.date)
    }

    const budgetFirstDay = this.budget?.days.find((day) =>
      isSameDay(day.date, date),
    )

    if (!budgetFirstDay) {
      return null
    }

    return this.budget?.days.indexOf(budgetFirstDay)
  }
}
