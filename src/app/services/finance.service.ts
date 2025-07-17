import { Injectable, WritableSignal } from '@angular/core'
import { tabs } from '@constants/budget.constants'
import { BudgetAccess } from '@data/access/budget.access'
import { RuleRepeatableAccess } from '@data/access/rule-repeatable.access'
import { RuleAccess } from '@data/access/rule.access'
import { SnapshotAccess } from '@data/access/snapshot.access'
import { BudgetAdd } from '@interfaces/budget-add.interface'
import { BudgetEdit } from '@interfaces/budget-edit.interface'
import { Budget } from '@interfaces/budget.interface'
import { DailyItem } from '@interfaces/daily-item.interface'
import { Event } from '@interfaces/event.interface'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import { SnapshotAdd } from '@interfaces/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshot-balance-add.interface'
import { Tab } from '@interfaces/tab.interface'
import { getDailyItemsForRule } from '@utilities/rule-daily.utilities'
import {
  getDefaultDays,
  getRulesSignalFromBudget,
  isRuleRepeatable,
} from '@utilities/rule.utilities'
import { formatISO, isSameDay } from 'date-fns'
import { ReplaySubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private budgetAccess = new BudgetAccess()
  private ruleAccess = new RuleAccess()
  private ruleRepeatableAccess = new RuleRepeatableAccess()
  private snapshotAccess = new SnapshotAccess()

  events = new ReplaySubject<Event>(1)
  budgets: Budget[] | null = null
  budget: Budget | null = null
  isLoaded = false
  tab: Tab = tabs[0]

  setTab(tab: Tab) {
    this.tab = tab
  }

  getFirstDate() {
    return this.budget?.days ? this.budget?.days()[0]?.date : null
  }

  getMostRecentSnapshotDate() {
    if (!this.budget?.snapshots || this.budget.snapshots.length === 0) {
      return null
    }

    return this.budget.snapshots()[0].date
  }

  getBalanceOn(date: Date | null) {
    if (!date || !this.budget || !this.budget.days) {
      return 0
    }

    const day = this.budget
      .days()
      .find((budgetDay) => isSameDay(budgetDay.date, date))

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
      this.budget.snapshots.update((snapshots) => {
        snapshots.push(snapshot)
        return snapshots
      })
    }
    this.setBudgetData(this.budget)

    // Send out the add budget event
    this.events.next({ resource: 'budget', event: 'add', budget })
  }

  async selectBudget(budget: Budget | null) {
    if (!budget) {
      this.budget = null
      return
    }

    // Load the data if needed
    if (!budget.isBalancesLoaded()) {
      budget.balances.set(await this.ruleAccess.getAll('balance', budget.id))
      budget.isBalancesLoaded.set(true)
    }
    if (!budget.isExpensesLoaded()) {
      budget.expenses.set(
        (await this.ruleRepeatableAccess.getAll(
          'expense',
          budget.id,
        )) as RuleRepeatable[],
      )
      budget.isExpensesLoaded.set(true)
    }
    if (!budget.isRevenuesLoaded()) {
      budget.revenues.set(
        (await this.ruleRepeatableAccess.getAll(
          'revenue',
          budget.id,
        )) as RuleRepeatable[],
      )
      budget.isRevenuesLoaded.set(true)
    }
    if (!budget.isSnapshotsLoaded()) {
      budget.snapshots.set(await this.snapshotAccess.getAll(budget.id))
      if (budget.snapshots && budget.snapshots()[0]) {
        budget.startDate = budget.snapshots()[0].date
      }
      budget.isSnapshotsLoaded.set(true)
    }

    // Regenerate the data
    this.setBudgetData(budget)
    this.budget = budget

    // Send event out for this
    this.events.next({
      resource: 'budget',
      event: 'select',
      budget: budget,
    })
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

  async snapshot(addSnapshot: SnapshotAdd, balances: SnapshotBalanceAdd[]) {
    if (!this.budget) {
      return
    }

    // Send request to save data
    const [snapshot, newBalances] = await this.snapshotAccess.save(
      addSnapshot,
      balances,
      this.getBalanceOn(addSnapshot.date),
    )

    // Update the service state
    this.budget.startDate = snapshot.date
    this.budget.snapshots.update((snapshots) => {
      snapshots?.unshift(snapshot)
      return snapshots
    })
    this.budget.balances.set(newBalances)

    this.setBudgetData(this.budget)
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
    rule.daily = getDailyItemsForRule(this.budget, rule)
    rule.yearlyAmount =
      rule.daily.reduce((sum, item) => sum + item.amount, 0) ?? 0

    const budgetField = getRulesSignalFromBudget(this.budget, ruleAdd.type)
    budgetField.update((rules) => {
      rules.push(rule)
      return rules
    })

    FinanceService.setBudgetDaysForRule(this.budget, rule, false)

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

    if (!rule) {
      // TODO: Better error handling
      return
    }

    // Update service state
    rule.daily = getDailyItemsForRule(this.budget, rule)
    rule.yearlyAmount =
      rule.daily.reduce((sum, item) => sum + item.amount, 0) ?? 0

    const rulesArray = getRulesSignalFromBudget(this.budget, ruleOriginal.type)
    rulesArray.update((currentItems) =>
      currentItems.map((item) => (item.id === rule.id ? rule : item)),
    )
    FinanceService.setBudgetDaysForRule(this.budget, rule, false)

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
    const rulesArray = getRulesSignalFromBudget(this.budget, rule.type)
    rulesArray.update((currentItems) =>
      currentItems.filter((item) => item.id !== rule.id),
    )

    FinanceService.setBudgetDaysForRule(this.budget, rule, true)

    // Send out delete event
    this.events.next({ resource: rule.type, event: 'delete', rule })
  }

  private static setBudgetDaysForRule(
    budget: Budget,
    rule: Rule,
    isDelete: boolean,
  ) {
    let lastBalance = 0

    const dailyItemsByDay = rule.daily
      ? rule.daily.reduce(
          (accumulator, item) => {
            const key = formatISO(item.day.date)
            if (!accumulator[key]) {
              accumulator[key] = []
            }
            accumulator[key].push(item)
            return accumulator
          },
          {} as Record<string, DailyItem[]>,
        )
      : {}

    budget.days.update((days) =>
      days.map((day) => {
        // Remove the daily data for the rule
        day.daily[rule.type] = day.daily[rule.type].filter(
          (dailyRevenue) => dailyRevenue.rule.id !== rule.id,
        )

        // Add the new daily data for the rule
        if (!isDelete) {
          const dailyItemsForDay = dailyItemsByDay[formatISO(day.date)]
          if (dailyItemsForDay) {
            for (const dailyItem of dailyItemsForDay) {
              day.daily[dailyItem.rule.type].push(dailyItem)
              day.total[dailyItem.rule.type] += dailyItem.amount
            }
          }
        }

        // Calculate the new total
        day.total[rule.type] = day.daily[rule.type].reduce(
          (sum, item) => sum + item.amount,
          0,
        )
        day.balance =
          lastBalance +
          day.total.balance +
          day.total.revenue -
          day.total.expense
        lastBalance = day.balance

        return day
      }),
    )
  }

  private static setRuleData(budget: Budget, type: RuleType) {
    const metadata = RulesMetadata[type]
    const records = budget[metadata.budgetFieldKey] as
      | WritableSignal<RuleRepeatable[]>
      | undefined

    if (!records) {
      return
    }

    records.update((rules) => {
      return rules.map((rule) => {
        rule.daily = getDailyItemsForRule(budget, rule)
        rule.yearlyAmount =
          rule.daily.reduce((sum, item) => sum + item.amount, 0) ?? 0
        return rule
      })
    })

    const dailyDataByDay = records().reduce(
      (accumulator, item) => {
        for (const dailyItem of item.daily) {
          const key = formatISO(dailyItem.day.date)
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(dailyItem)
        }
        return accumulator
      },
      {} as Record<string, DailyItem[]>,
    )

    let lastBalance = 0

    budget.days.update((days) => {
      return days.map((day) => {
        // This assumes the daily data has already been cleared via the
        // setBudgetData method
        const dailyItemsForDay = dailyDataByDay[formatISO(day.date)]
        if (dailyItemsForDay) {
          for (const dailyItem of dailyItemsForDay) {
            day.daily[dailyItem.rule.type].push(dailyItem)
            day.total[dailyItem.rule.type] += dailyItem.amount
          }
        }

        day.balance =
          lastBalance +
          day.total.balance +
          day.total.revenue -
          day.total.expense
        lastBalance = day.balance

        return day
      })
    })
  }

  private setBudgetData(budget: Budget | null) {
    if (!budget) {
      return
    }

    budget.days.set(getDefaultDays(budget.startDate))
    FinanceService.setRuleData(budget, 'balance')
    FinanceService.setRuleData(budget, 'revenue')
    FinanceService.setRuleData(budget, 'expense')
  }
}
