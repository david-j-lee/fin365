import { Injectable } from '@angular/core'
import { Balance } from '@interfaces/balances/balance.interface'
import { BudgetAdd } from '@interfaces/budgets/budget-add.interface'
import { BudgetEdit } from '@interfaces/budgets/budget-edit.interface'
import { Budget } from '@interfaces/budgets/budget.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageBudgetService {
  getAll(): Observable<Budget[]> {
    const budgets = localStorageService.getObject<Budget>('budgets')
    return of(Object.values(budgets))
  }

  add(value: BudgetAdd) {
    const budgets = localStorageService.getObject<Budget>('budgets')
    const budgetId = getRansomStringFromObject(budgets)
    const budgetAdd = {
      ...value,
      id: budgetId,
      isActive: true,
    }

    localStorageService.setObject('budgets', {
      ...budgets,
      [budgetId]: budgetAdd,
    })

    budgets[budgetId] = {
      ...budgetAdd,
      isBalancesLoaded: false,
      isRevenuesLoaded: false,
      isExpensesLoaded: false,
      isSnapshotsLoaded: false,
      balances: [],
      revenues: [],
      expenses: [],
      snapshots: [],
      days: [],
    }

    const snapshots = localStorageService.getObject<Snapshot>('snapshots')
    const snapshotId = getRansomStringFromObject(snapshots)
    const snapshotResponse = {
      id: snapshotId,
      date: value.startDate,
      actualBalance: 0,
      estimatedBalance: 0,
      balanceDifference: 0,
      budgetId,
    }
    snapshots[snapshotResponse.id] = snapshotResponse
    localStorageService.setObject('snapshots', snapshots)

    return of({ budgetId, snapshotId })
  }

  update(value: BudgetEdit) {
    const budgets = localStorageService.getObject<Budget>('budgets')
    if (budgets[value.id]) {
      const budget = budgets[value.id]
      budget.name = value.name
      budget.isActive = value.isActive
      localStorageService.setObject('budgets', budgets)
      return of(budget)
    }
    return of(false)
  }

  delete(id: number | string) {
    const budgets = localStorageService.getObject<Budget>('budgets')
    if (budgets[id]) {
      delete budgets[id]
      localStorageService.setObject('budgets', budgets)

      const balances = localStorageService.getObject<Balance>('balances')
      const filteredBalances = Object.fromEntries(
        Object.entries(balances).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('balances', filteredBalances)

      const revenues = localStorageService.getObject<Revenue>('revenues')
      const filteredRevenues = Object.fromEntries(
        Object.entries(revenues).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('revenues', filteredRevenues)

      const expenses = localStorageService.getObject<Expense>('expenses')
      const filteredExpenses = Object.fromEntries(
        Object.entries(expenses).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('expenses', filteredExpenses)

      const snapshots = localStorageService.getObject<Snapshot>('snapshots')
      const filteredSnapshots = Object.fromEntries(
        Object.entries(snapshots).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('snapshots', filteredSnapshots)

      return of(true)
    }
    return of(false)
  }
}
