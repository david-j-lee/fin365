import { Balance } from '@interfaces/balances/balance.interface'
import { Day } from '@interfaces/daily/day.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { Moment } from 'moment'

export interface Budget {
  id: number | string
  isBalancesLoaded: boolean
  isRevenuesLoaded: boolean
  isExpensesLoaded: boolean
  isSnapshotsLoaded: boolean

  name: string
  startDate: Moment
  isActive: boolean

  balances: Balance[] | undefined
  revenues: Revenue[] | undefined
  expenses: Expense[] | undefined

  snapshots: Snapshot[] | undefined

  days: Day[] | undefined
}
