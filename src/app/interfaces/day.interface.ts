import { DailyItem } from './daily-item.interface'
import { RuleType } from '@interfaces/rule.interface'
import { Moment } from 'moment'

export interface Day {
  date: Moment
  month: number
  year: number

  daily: Record<RuleType, DailyItem[]>
  total: Record<RuleType, number>
  balance: number
}
