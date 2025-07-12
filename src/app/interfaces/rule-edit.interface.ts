import { RuleType } from './rule.interface'

export interface RuleEdit {
  type: RuleType
  id: string

  description: string
  amount: number
}
