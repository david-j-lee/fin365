import { SnapshotEntity } from '@data/entities/snapshots.entity'
import { Moment } from 'moment'

export interface Snapshot extends Omit<SnapshotEntity, 'date'> {
  date: Moment
  balanceDifference: number
}
