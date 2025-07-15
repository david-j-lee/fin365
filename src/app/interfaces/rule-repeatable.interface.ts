import { Rule } from './rule.interface'
import { RuleRepeatableEntity } from '@data/entities/rule-repeatable.entity'

export interface RuleRepeatable
  extends Omit<RuleRepeatableEntity, 'startDate' | 'endDate'>,
    Rule {
  startDate?: Date | null
  endDate?: Date | null
}
