import { RuleType } from './rule.interface'

export interface RuleAdd {
  type: RuleType
  budgetId: string

  description: string
  amount: number
}
