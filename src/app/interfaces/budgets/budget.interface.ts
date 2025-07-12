import { Day } from '@interfaces/daily/day.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import { Rule } from '@interfaces/rules/rule.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { Moment } from 'moment'

export interface Budget {
  id: string
  name: string
  startDate: Moment
  isActive: boolean

  isBalancesLoaded: boolean
  isRevenuesLoaded: boolean
  isExpensesLoaded: boolean
  isSnapshotsLoaded: boolean

  balances: Rule[]
  revenues: RepeatableRule[]
  expenses: RepeatableRule[]

  snapshots: Snapshot[]

  days: Day[]
}
