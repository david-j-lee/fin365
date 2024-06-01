import { SnapshotAdd } from '@interfaces/snapshots/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshots/snapshot-balance-add.interface'

export interface SnapshotAddAll {
  budgetId: number | string | undefined
  snapshot: SnapshotAdd
  snapshotBalances: SnapshotBalanceAdd[]
}
