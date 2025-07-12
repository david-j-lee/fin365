import { Budget } from '@interfaces/budgets/budget.interface'
import { Rule } from '@interfaces/rules/rule.interface'
import { SnapshotAddAll } from '@interfaces/snapshots/snapshot-add-all.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { localStorageService } from '@storage/local-storage/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import moment from 'moment'
import { Observable, of } from 'rxjs'

export const LocalStorageSnapshotService = {
  getAll(budgetId: string): Observable<Snapshot[]> {
    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    return of(
      Object.values(snapshots).filter(
        (snapshot: Snapshot) => snapshot.budgetId === budgetId,
      ),
    )
  },
  save(value: SnapshotAddAll): Observable<{
    snapshotId: string
    balanceIds: string[]
  }> {
    // Add a snapshot
    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    const id = getRansomStringFromObject(snapshots)

    snapshots[id] = {
      ...value.snapshot,
      balanceDifference:
        value.snapshot.actualBalance - value.snapshot.estimatedBalance,
      budgetId: value.budgetId,
      date: moment(value.snapshot.date, 'MM/DD/YYYY').utcOffset(
        moment().utcOffset(),
      ),
      id,
    }

    localStorageService.setObject('snapshots', snapshots)

    // Remove and add new balances
    const balances = localStorageService.getObject<Rule>('balances')
    const filteredBalances = Object.fromEntries(
      Object.entries(balances).filter(
        ([, balance]) => balance.budgetId !== value.budgetId,
      ),
    )

    value.snapshotBalances.forEach((snapshotBalance) => {
      filteredBalances[snapshotBalance.id] = {
        ...snapshotBalance,
        type: 'balance',
        budgetId: value.budgetId,
      }
    })

    localStorageService.setObject('balances', filteredBalances)

    // Update budget start date
    const budgets = localStorageService.getObject<Budget>('budgets')
    const budget = budgets[value.budgetId ?? '']

    if (budget) {
      budget.startDate = snapshots[id].date
      localStorageService.setObject('budgets', budgets)
    }

    return of({
      balanceIds: value.snapshotBalances.map((balance) => balance.id),
      snapshotId: id,
    })
  },
  delete(id: string) {
    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    if (snapshots[id]) {
      delete snapshots[id]
      return of(true)
    }
    return of(false)
  },
}
