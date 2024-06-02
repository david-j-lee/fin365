import { Injectable } from '@angular/core'
import { Balance } from '@interfaces/balances/balance.interface'
import { Budget } from '@interfaces/budgets/budget.interface'
import { SnapshotAddAll } from '@interfaces/snapshots/snapshot-add-all.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import moment from 'moment'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageSnapshotService {
  getAll(budgetId: number | string): Observable<Snapshot[]> {
    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    return of(
      Object.values(snapshots).filter(
        (snapshot: Snapshot) => snapshot.budgetId === budgetId,
      ),
    )
  }

  save(value: SnapshotAddAll): Observable<{
    snapshotId: string
    balanceIds: string[]
  }> {
    if (!value.budgetId) {
      throw new Error('Budget ID is required')
    }

    // add a snapshot
    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    const id = getRansomStringFromObject(snapshots)
    snapshots[id] = {
      ...value.snapshot,
      id,
      date: moment(value.snapshot.date, 'MM/DD/YYYY').utcOffset(
        moment().utcOffset(),
      ),
      budgetId: value.budgetId,
      balanceDifference:
        value.snapshot.actualBalance - value.snapshot.estimatedBalance,
    }
    localStorageService.setObject('snapshots', snapshots)

    // remove and add new balances
    const balances = localStorageService.getObject<Balance>('balances')
    const filteredBalances = Object.fromEntries(
      Object.entries(balances).filter(
        ([, balance]) => balance.budgetId !== value.budgetId,
      ),
    )
    value.snapshotBalances.forEach((balance) => {
      if (value.budgetId) {
        filteredBalances[balance.id] = { ...balance, budgetId: value.budgetId }
      }
    })
    localStorageService.setObject('balances', filteredBalances)

    // update budget start date
    const budgets = localStorageService.getObject<Budget>('budgets')
    const budget = budgets[value.budgetId ?? '']
    if (budget) {
      budget.startDate = snapshots[id].date
      localStorageService.setObject('budgets', budgets)
    }

    return of({
      snapshotId: id,
      balanceIds: value.snapshotBalances.map((balance) => balance.id),
    })
  }

  delete(id: number | string) {
    const snapshots = localStorageService.getObject('snapshots')
    if (snapshots[id]) {
      delete snapshots[id]
      return of(true)
    }
    return of(false)
  }
}
