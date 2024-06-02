import { Moment } from 'moment'

export interface SnapshotAdd {
  date: Moment
  estimatedBalance: number
  actualBalance: number
}
