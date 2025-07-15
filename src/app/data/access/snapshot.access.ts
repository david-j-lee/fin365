import { LocalStorageSnapshotService } from '@data/local-storage/local-storage.snapshot'
import { Rule } from '@interfaces/rule.interface'
import { SnapshotAddAll } from '@interfaces/snapshot-add-all.interface'
import { SnapshotAdd } from '@interfaces/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshot-balance-add.interface'
import { Snapshot } from '@interfaces/snapshot.interface'
import { compareDesc, parseISO } from 'date-fns'

const SERVICE = 'localStorageSnapshotService'

export class SnapshotAccess {
  private localStorageSnapshotService = LocalStorageSnapshotService

  async getAll(budgetId: string): Promise<Snapshot[]> {
    const data = await this[SERVICE].getAll(budgetId)
    return data
      .map((record) => {
        const mappedRecord: Snapshot = {
          ...record,
          date: parseISO(record.date),
          balanceDifference: record.actualBalance - record.estimatedBalance,
        }
        return mappedRecord
      })
      .toSorted((a, b) => compareDesc(a.date, b.date))
  }

  async save(
    addSnapshot: SnapshotAdd,
    balances: SnapshotBalanceAdd[],
    estimatedBalance: number,
  ): Promise<[Snapshot, Rule[]]> {
    const { budgetId } = addSnapshot
    const filteredBalances = balances.filter((balance) => balance.id)

    // Calculate balances
    const newAddSnapshot: SnapshotAdd = {
      ...addSnapshot,
      estimatedBalance,
      actualBalance: filteredBalances.reduce(
        (sum, item) => sum + item.amount,
        0,
      ),
    }

    // Wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId,
      snapshot: newAddSnapshot,
      snapshotBalances: filteredBalances,
    }

    const result = await this[SERVICE].save(snapshotAddAll)

    // Add snapshot to local data
    const snapshot: Snapshot = {
      id: result.snapshot.id,
      date: new Date(addSnapshot.date),
      estimatedBalance: newAddSnapshot.estimatedBalance,
      actualBalance: newAddSnapshot.actualBalance,
      balanceDifference:
        newAddSnapshot.actualBalance - newAddSnapshot.estimatedBalance,
      budgetId,
    }

    // Update balances in local data
    let newBalanceIndex = 0
    const newBalances: Rule[] = []

    for (const balance of result.balances) {
      let balanceId = ''
      if (!balance.id) {
        balanceId = result.balances[newBalanceIndex].id
        newBalanceIndex += 1
      }
      newBalances.push({
        type: 'balance',
        id: balanceId,
        description: balance.description,
        amount: balance.amount,
        budgetId,
        yearlyAmount: balance.amount,
        daily: [],
      })
    }

    return [snapshot, newBalances]
  }
}
