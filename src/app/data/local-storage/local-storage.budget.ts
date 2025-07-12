import { BudgetEntity } from '@data/entities/budget.entity'
import { RuleRepeatableEntity } from '@data/entities/rule-repeatable.entity'
import { RuleEntity } from '@data/entities/rule.entity'
import { SnapshotEntity } from '@data/entities/snapshots.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { BudgetAdd } from '@interfaces/budget-add.interface'
import { BudgetEdit } from '@interfaces/budget-edit.interface'
import { getRansomStringFromObject } from '@utilities/string-utilities'

export const LocalStorageBudgetService = {
  async getAll(): Promise<BudgetEntity[]> {
    return Promise.resolve(
      Object.values(localStorageService.getObject<BudgetEntity>('budgets')),
    )
  },
  async add(
    value: BudgetAdd,
  ): Promise<{ budget: BudgetEntity; snapshot: SnapshotEntity }> {
    const budgets = localStorageService.getObject<BudgetEntity>('budgets')
    const budget: BudgetEntity = {
      ...value,
      startDate: value.startDate.toString(),
      id: getRansomStringFromObject(budgets),
      isActive: true,
    }
    localStorageService.setObject('budgets', {
      ...budgets,
      [budget.id]: budget,
    })
    budgets[budget.id] = budget

    const snapshots = localStorageService.getObject<SnapshotEntity>('snapshots')
    const snapshot: SnapshotEntity = {
      id: getRansomStringFromObject(snapshots),
      date: value.startDate.toString(),
      actualBalance: 0,
      estimatedBalance: 0,
      budgetId: budget.id,
    }
    snapshots[snapshot.id] = snapshot
    localStorageService.setObject('snapshots', snapshots)

    return Promise.resolve({ budget, snapshot })
  },
  async update(value: BudgetEdit): Promise<BudgetEntity | null> {
    const budgets = localStorageService.getObject<BudgetEntity>('budgets')
    const budget = budgets[value.id]
    if (!budget) {
      return Promise.resolve(null)
    }
    budget.name = value.name
    budget.isActive = value.isActive
    localStorageService.setObject('budgets', budgets)
    return Promise.resolve(budget)
  },
  async delete(id: string): Promise<boolean> {
    const budgets = localStorageService.getObject<BudgetEntity>('budgets')
    if (budgets[id]) {
      delete budgets[id]
      localStorageService.setObject('budgets', budgets)

      const balances = localStorageService.getObject<RuleEntity>('balances')
      const filteredBalances = Object.fromEntries(
        Object.entries(balances).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('balances', filteredBalances)

      const revenues =
        localStorageService.getObject<RuleRepeatableEntity>('revenues')
      const filteredRevenues = Object.fromEntries(
        Object.entries(revenues).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('revenues', filteredRevenues)

      const expenses =
        localStorageService.getObject<RuleRepeatableEntity>('expenses')
      const filteredExpenses = Object.fromEntries(
        Object.entries(expenses).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('expenses', filteredExpenses)

      const snapshots =
        localStorageService.getObject<SnapshotEntity>('snapshots')
      const filteredSnapshots = Object.fromEntries(
        Object.entries(snapshots).filter(([, value]) => value.budgetId !== id),
      )
      localStorageService.setObject('snapshots', filteredSnapshots)

      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  },
}
