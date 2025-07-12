import { Rule } from '@interfaces/rules/rule.interface'

export interface EventRuleChange {
  event: 'add' | 'update' | 'delete'
  rule: Rule
}
