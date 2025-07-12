import { Rule, RuleType } from '@interfaces/rule.interface'

export interface EventRuleChange {
  resource: RuleType
  event: 'add' | 'update' | 'delete'
  rule: Rule
}
