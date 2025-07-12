export type RuleRepeatableType = 'revenue' | 'expense' | 'savings'
export type RuleType = 'balance' | RuleRepeatableType

export interface RuleEntity {
  type: RuleType
  id: string
  budgetId: string

  description: string
  amount: number
}
