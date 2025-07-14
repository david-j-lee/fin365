import { DailyItem } from '@interfaces/daily-item.interface'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import {
  addMonths,
  addYears,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  startOfWeek,
} from 'date-fns'

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
  [budgetStart, budgetEnd]: [Date, Date],
  [itemStart, itemEnd]: [Date | null | undefined, Date | null | undefined],
  frequency: string,
  isForever: boolean,
): [Date, Date] {
  let start = new Date(budgetStart)

  if (frequency === 'Weekly' || frequency === 'Bi-Weekly') {
    if (isForever) {
      start = startOfWeek(start)
    } else if (itemStart) {
      start = startOfWeek(itemStart)
    }
  }

  // If monthly get most recent month
  if (frequency === 'Monthly' && itemStart) {
    if (itemStart < budgetStart) {
      const monthNeeded = differenceInCalendarMonths(budgetStart, itemStart)
      start = addMonths(itemStart, monthNeeded)
    } else {
      start = new Date(itemStart)
    }
  }

  // If yearly get most recent year
  if (frequency === 'Yearly' && itemStart) {
    if (itemStart < budgetStart) {
      const yearsNeeded = differenceInCalendarYears(budgetStart, itemStart)
      start = addYears(itemStart, yearsNeeded)
    } else {
      start = new Date(itemStart)
    }
  }

  // end date
  let end = new Date(budgetEnd)
  if (!isForever && itemEnd && itemEnd <= budgetEnd) {
    end = new Date(itemEnd)
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
