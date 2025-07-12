import { Moment } from 'moment'

export interface SnapshotAdd {
  budgetId: string
  date: Moment
  estimatedBalance: number
  actualBalance: number
}
