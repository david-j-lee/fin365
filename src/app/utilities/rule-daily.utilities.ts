import { getRuleRange, getRuleRepeatDays } from './rule.utilities'
import { numberOfDays } from '@constants/budget.constants'
import { Budget } from '@interfaces/budget.interface'
import { DailyItem } from '@interfaces/daily-item.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  isSameDay,
} from 'date-fns'

export function getDailyItemsForRule(
  budget: Budget,
  rule: Rule | RuleRepeatable,
): DailyItem[] {
  if (!budget) {
    return []
  }

  let daily: DailyItem[] | null = null

  if ('frequency' in rule) {
    switch (rule.frequency) {
      case 'Once':
        daily = generateRuleOnce(budget, rule)
        break
      case 'Daily':
        daily = generateRuleDaily(budget, rule)
        break
      case 'Weekly':
        daily = generateRuleWeeks(budget, rule, 1)
        break
      case 'Bi-Weekly':
        daily = generateRuleWeeks(budget, rule, 2)
        break
      case 'Monthly':
        daily = generateRuleMonths(budget, rule, 1)
        break
      case 'Yearly':
        daily = generateRuleMonths(budget, rule, 12)
        break
      default:
        console.error(`Encountered unknown frequency ${rule.frequency}`)
        break
    }
  } else {
    // If it's a one-time rule, we can just generate it once
    daily = generateRuleOnce(budget, rule)
  }

  // Add any meta data or calculated data to the rule
  return daily ?? []
}

function generateRuleOnce(
  budget: Budget,
  rule: Rule | RuleRepeatable,
): DailyItem[] | null {
  if (!budget) {
    return null
  }

  const day =
    'startDate' in rule
      ? budget
          .days()
          ?.find(
            (budgetDay) =>
              rule.startDate && isSameDay(budgetDay.date, rule.startDate),
          )
      : budget.days()[0]

  if (!day) {
    return null
  }

  return [
    {
      day,
      rule,
      amount: rule.amount,
    },
  ]
}

function generateRuleDaily(
  budget: Budget,
  rule: RuleRepeatable,
): DailyItem[] | null {
  if (!budget?.days) {
    return null
  }

  const [startDate, endDate] = getRuleRange(
    [budget.startDate, addDays(budget.startDate, numberOfDays)],
    [rule.startDate, rule.endDate],
    rule.frequency,
    rule.isForever,
  )
  const minDay = budget?.days().find((day) => isSameDay(day.date, startDate))

  if (!minDay) {
    return null
  }

  const minDayIndex = budget?.days().indexOf(minDay)
  const numLoops = differenceInCalendarDays(endDate, startDate)
  const dailyItems: DailyItem[] = []

  for (let i = 0; i < numLoops; i++) {
    const day = budget?.days()[minDayIndex + i]

    if (!day) {
      continue
    }

    dailyItems.push({
      day,
      rule,
      amount: rule.amount,
    })
  }

  if (dailyItems.length === 0) {
    return null
  }

  return dailyItems
}

function generateRuleWeeks(
  budget: Budget,
  rule: RuleRepeatable,
  byWeeks: number,
): DailyItem[] | null {
  if (!budget?.days) {
    return null
  }

  const skipDays = byWeeks * 7
  const repeatDays = getRuleRepeatDays(rule)
  const [startDate, endDate] = getRuleRange(
    [budget.startDate, addDays(budget.startDate, numberOfDays)],
    [rule.startDate, rule.endDate],
    rule.frequency,
    rule.isForever,
  )
  const firstDateIndex = getFirstDayIndex(budget, startDate)

  if (firstDateIndex === null) {
    return null
  }

  const numLoops = differenceInCalendarDays(endDate, startDate) / skipDays
  const dailyItems: DailyItem[] = []

  for (let i = 0; i < numLoops; i++) {
    for (const repeatDay of repeatDays) {
      const day = budget?.days()[firstDateIndex + i * skipDays + repeatDay]

      if (!day) {
        continue
      }

      dailyItems.push({
        day,
        rule,
        amount: rule.amount,
      })
    }
  }

  if (dailyItems.length === 0) {
    return null
  }

  return dailyItems
}

function generateRuleMonths(
  budget: Budget,
  rule: RuleRepeatable,
  numMonths: number,
): DailyItem[] | null {
  if (!budget?.days) {
    return null
  }

  const [firstDate, maxDate] = getRuleRange(
    [budget.startDate, addDays(budget.startDate, numberOfDays)],
    [rule.startDate, rule.endDate],
    rule.frequency,
    rule.isForever,
  )
  const budgetFirstDay = budget
    ?.days()
    .find((day) => isSameDay(day.date, firstDate))

  if (!budgetFirstDay) {
    return null
  }

  const firstDateIndex = budget?.days().indexOf(budgetFirstDay)
  const numLoops = differenceInCalendarMonths(maxDate, firstDate) / numMonths
  const dailyItems: DailyItem[] = []

  for (let i = 0; i <= numLoops; i++) {
    const date = addMonths(firstDate, i * numMonths)
    const day =
      budget?.days()[firstDateIndex + differenceInCalendarDays(date, firstDate)]

    if (!day) {
      continue
    }

    dailyItems.push({
      day,
      rule,
      amount: rule.amount,
    })
  }

  if (dailyItems.length === 0) {
    return null
  }

  return dailyItems
}

function getFirstDayIndex(budget: Budget, date: Date) {
  if (!budget?.days()) {
    return null
  }

  const [firstDay] = budget.days()

  if (date < firstDay.date) {
    return differenceInCalendarDays(date, firstDay.date)
  }

  const budgetFirstDay = budget?.days().find((day) => isSameDay(day.date, date))

  if (!budgetFirstDay) {
    return null
  }

  return budget?.days().indexOf(budgetFirstDay)
}
