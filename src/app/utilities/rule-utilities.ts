import { DailyItem } from '@interfaces/daily-item.interface'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import { Moment } from 'moment'

export function isRuleRepeatable(
  rule:
    | Rule
    | RuleAdd
    | RuleEdit
    | RuleRepeatable
    | RuleRepeatableAdd
    | RuleRepeatableEdit,
): rule is RuleRepeatable {
  return 'frequency' in rule
}

export function isRuleRepeatableArray(
  rules: Rule[],
): rules is RuleRepeatable[] {
  return rules.every(isRuleRepeatable)
}

export function getRuleRepeatDays(item: RuleRepeatable): number[] {
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

export function getRuleRange(
  [budgetStart, budgetEnd]: [Moment, Moment],
  [itemStart, itemEnd]: [Moment | null | undefined, Moment | null | undefined],
  frequency: string,
  isForever: boolean,
): [Moment, Moment] {
  let start = budgetStart.clone()

  if (frequency === 'Weekly' || frequency === 'Bi-Weekly') {
    if (isForever) {
      start = start.weekday(0)
    } else if (itemStart) {
      start = itemStart.clone().weekday(0)
    }
  }

  // If monthly get most recent month
  if (frequency === 'Monthly' && itemStart) {
    if (itemStart < budgetStart) {
      const monthNeeded = Math.ceil(budgetStart.diff(itemStart, 'months', true))
      start = itemStart.clone().add(monthNeeded, 'M')
    } else {
      start = itemStart.clone()
    }
  }

  // If yearly get most recent year
  if (frequency === 'Yearly' && itemStart) {
    if (itemStart < budgetStart) {
      const yearsNeeded = Math.ceil(budgetStart.diff(itemStart, 'years', true))
      start = itemStart.clone().add(yearsNeeded, 'year')
    } else {
      start = itemStart.clone()
    }
  }

  // end date
  let end = budgetEnd.clone()
  if (!isForever && itemEnd && itemEnd <= budgetEnd) {
    end = itemEnd
  }

  return [start, end]
}

export function getRuleTotal(rule: Rule): number {
  return rule.daily ? rule.daily.reduce((sum, item) => sum + item.amount, 0) : 0
}

export function addDailyItem(dailyItem: DailyItem) {
  // Add the daily item to the day
  dailyItem.day.daily[dailyItem.rule.type].push(dailyItem)
  dailyItem.day.total[dailyItem.rule.type] += dailyItem.amount

  // Also across reference it back in the rule
  if (!dailyItem.rule.daily) {
    dailyItem.rule.daily = []
  }

  dailyItem.rule.daily.push(dailyItem)
}
