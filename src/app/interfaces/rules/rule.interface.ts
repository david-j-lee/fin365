import { DailyItem } from '@interfaces/daily/daily-item.interface'

export type RepeatableRuleType = 'revenue' | 'expense' | 'savings'
export type RuleType = 'balance' | RepeatableRuleType

export interface Rule {
  type: RuleType
  id: string
  budgetId: string

  description: string
  amount: number

  yearlyAmount?: number
  daily?: DailyItem[]
}
