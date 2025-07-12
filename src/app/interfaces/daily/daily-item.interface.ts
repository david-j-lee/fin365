import { Day } from '@interfaces/daily/day.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import { Rule } from '@interfaces/rules/rule.interface'

export interface DailyItem {
  day: Day
  rule: Rule | RepeatableRule
  amount: number
}
