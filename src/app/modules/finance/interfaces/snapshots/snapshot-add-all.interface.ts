import { SnapshotAdd } from '../snapshots/snapshot-add.interface';
import { SnapshotBalanceAdd } from '../snapshots/snapshot-balance-add.interface';

export interface SnapshotAddAll {
  budgetId: number | string | undefined;
  snapshot: SnapshotAdd;
  snapshotBalances: SnapshotBalanceAdd[];
}
