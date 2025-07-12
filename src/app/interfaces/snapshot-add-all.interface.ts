import { SnapshotAdd } from '@interfaces/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshot-balance-add.interface'

export interface SnapshotAddAll {
  budgetId: string
  snapshot: SnapshotAdd
  snapshotBalances: SnapshotBalanceAdd[]
}
