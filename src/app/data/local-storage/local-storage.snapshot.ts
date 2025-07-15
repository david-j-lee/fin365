import { BudgetEntity } from '@data/entities/budget.entity'
import { RuleEntity } from '@data/entities/rule.entity'
import { SnapshotEntity } from '@data/entities/snapshots.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { SnapshotAddAll } from '@interfaces/snapshot-add-all.interface'
import { getRansomStringFromObject } from '@utilities/string-utilities'

export const LocalStorageSnapshotService = {
  async getAll(budgetId: string): Promise<SnapshotEntity[]> {
    return Promise.resolve(
      Object.values(
        localStorageService.getObject<SnapshotEntity>('snapshots'),
      ).filter((snapshot: SnapshotEntity) => snapshot.budgetId === budgetId),
    )
  },
  async save(snapshotAddAll: SnapshotAddAll): Promise<{
    snapshot: SnapshotEntity
    balances: RuleEntity[]
  }> {
    // Add a snapshot
    const snapshots = localStorageService.getObject<SnapshotEntity>('snapshots')
    const snapshot = {
      ...snapshotAddAll.snapshot,
      id: getRansomStringFromObject(snapshots),
      budgetId: snapshotAddAll.budgetId,
      date: snapshotAddAll.snapshot.date.toISOString(),
    }
    snapshots[snapshot.id] = snapshot
    localStorageService.setObject('snapshots', snapshots)

    // Remove and add new balances
    const balances = localStorageService.getObject<RuleEntity>('balances')
    const newBalances = Object.fromEntries(
      Object.entries(balances).filter(
        ([, balance]) => balance.budgetId !== snapshotAddAll.budgetId,
      ),
    )
    const snapshotBalances: RuleEntity[] = []
    snapshotAddAll.snapshotBalances.forEach((snapshotBalance) => {
      const balance: RuleEntity = {
        ...snapshotBalance,
        type: 'balance',
        budgetId: snapshotAddAll.budgetId,
      }
      newBalances[snapshotBalance.id] = balance
      snapshotBalances.push(balance)
    })
    localStorageService.setObject('balances', newBalances)

    // Update budget start date
    const budgets = localStorageService.getObject<BudgetEntity>('budgets')
    const budget = budgets[snapshotAddAll.budgetId ?? '']
    if (budget) {
      budget.startDate = snapshots[snapshot.id].date
      localStorageService.setObject('budgets', budgets)
    }

    return Promise.resolve({
      snapshot: snapshot,
      balances: snapshotBalances,
    })
  },
  async delete(id: string): Promise<boolean> {
    const snapshots = localStorageService.getObject<SnapshotEntity>('snapshots')
    if (!snapshots[id]) {
      return Promise.resolve(false)
    }
    delete snapshots[id]
    localStorageService.setObject('snapshots', snapshots)
    return Promise.resolve(true)
  },
}
