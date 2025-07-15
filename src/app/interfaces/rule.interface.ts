import { Budget } from './budget.interface'
import { RuleEntity } from '@data/entities/rule.entity'
import { DailyItem } from '@interfaces/daily-item.interface'

export type RuleRepeatableType = 'revenue' | 'expense' | 'savings'
export type RuleType = 'balance' | RuleRepeatableType

export interface RuleMetadata {
  type: RuleType
  tableName: string
  budgetFieldKey: keyof Budget
}

export const RulesMetadata: Record<RuleType, RuleMetadata> = {
  balance: {
    type: 'balance',
    budgetFieldKey: 'balances',
    tableName: 'balances',
  },
  revenue: {
    type: 'revenue',
    budgetFieldKey: 'revenues',
    tableName: 'revenues',
  },
  expense: {
    type: 'expense',
    budgetFieldKey: 'expenses',
    tableName: 'expenses',
  },
  savings: { type: 'savings', budgetFieldKey: 'savings', tableName: 'savings' },
}

export interface Rule extends RuleEntity {
  yearlyAmount: number
  daily: DailyItem[]
}
