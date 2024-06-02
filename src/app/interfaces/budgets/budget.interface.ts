import { Balance } from '@interfaces/balances/balance.interface'
import { Day } from '@interfaces/daily/day.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
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

  balances: Balance[]
  revenues: Revenue[]
  expenses: Expense[]

  snapshots: Snapshot[]

  days: Day[]
}
