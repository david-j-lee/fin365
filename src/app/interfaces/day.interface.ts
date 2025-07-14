import { DailyItem } from './daily-item.interface'
import { RuleType } from '@interfaces/rule.interface'

export interface Day {
  date: Date
  month: number
  year: number

  daily: Record<RuleType, DailyItem[]>
  total: Record<RuleType, number>
  balance: number
}
