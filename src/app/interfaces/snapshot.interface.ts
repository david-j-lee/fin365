import { SnapshotEntity } from '@data/entities/snapshots.entity'

export interface Snapshot extends Omit<SnapshotEntity, 'date'> {
  date: Date
  balanceDifference: number
}
