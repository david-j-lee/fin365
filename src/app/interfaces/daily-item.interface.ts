import { Day } from '@interfaces/day.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'

export interface DailyItem {
  day: Day
  rule: Rule | RuleRepeatable
  amount: number
}
