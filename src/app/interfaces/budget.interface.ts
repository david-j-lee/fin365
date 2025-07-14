import { BudgetEntity } from '@data/entities/budget.entity'
import { Day } from '@interfaces/day.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import { Snapshot } from '@interfaces/snapshot.interface'

export interface Budget extends Omit<BudgetEntity, 'startDate'> {
  startDate: Date

  isBalancesLoaded: boolean
  isRevenuesLoaded: boolean
  isExpensesLoaded: boolean
  isSnapshotsLoaded: boolean

  balances: Rule[]
  revenues: RuleRepeatable[]
  expenses: RuleRepeatable[]
  savings: RuleRepeatable[]

  snapshots: Snapshot[]

  days: Day[]
}
