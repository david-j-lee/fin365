import { WritableSignal } from '@angular/core'
import { BudgetEntity } from '@data/entities/budget.entity'
import { Day } from '@interfaces/day.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule } from '@interfaces/rule.interface'
import { Snapshot } from '@interfaces/snapshot.interface'

export interface Budget extends Omit<BudgetEntity, 'startDate'> {
  startDate: Date

  isBalancesLoaded: WritableSignal<boolean>
  isRevenuesLoaded: WritableSignal<boolean>
  isExpensesLoaded: WritableSignal<boolean>
  isSnapshotsLoaded: WritableSignal<boolean>

  balances: WritableSignal<Rule[]>
  revenues: WritableSignal<RuleRepeatable[]>
  expenses: WritableSignal<RuleRepeatable[]>
  savings: WritableSignal<RuleRepeatable[]>

  snapshots: WritableSignal<Snapshot[]>

  days: WritableSignal<Day[]>
}
