import { numberOfDays } from '@constants/budget.constants'
import { Day } from '@interfaces/day.interface'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  getMonth,
  getYear,
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
    if (itemStart < budgetStart && isForever) {
      const monthNeeded = differenceInCalendarMonths(budgetStart, itemStart) + 1
      start = addMonths(itemStart, monthNeeded)
    } else {
      start = new Date(itemStart)
    }
  }

  // If yearly get most recent year
  if (frequency === 'Yearly' && itemStart) {
    if (itemStart < budgetStart && isForever) {
      const yearsNeeded = differenceInCalendarYears(budgetStart, itemStart) + 1
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

export function getDefaultDays(startDate: Date) {
  const days: Day[] = []

  for (let i = 0; i < numberOfDays; i++) {
    const date = addDays(startDate, i)
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
    days.push(day)
  }

  return days
}

export function getAlpha(baseAlpha: number, factor: number) {
  return baseAlpha + (1 - baseAlpha) * factor
}
