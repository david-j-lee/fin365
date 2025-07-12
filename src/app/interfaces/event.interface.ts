import { EventBudgetChange } from './event-budget-change.interface'
import { EventRuleChange } from './event-rule-change.interface'

export type Event = EventBudgetChange | EventRuleChange
