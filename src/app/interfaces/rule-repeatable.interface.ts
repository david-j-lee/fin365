import { Rule } from './rule.interface'
import { RuleRepeatableEntity } from '@data/entities/rule-repeatable.entity'
import { Moment } from 'moment'

export interface RuleRepeatable
  extends Omit<RuleRepeatableEntity, 'startDate' | 'endDate'>,
    Rule {
  startDate?: Moment | null
  endDate?: Moment | null
}
