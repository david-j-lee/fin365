import { Moment } from 'moment'

export interface Snapshot {
  id: string
  budgetId: string
  date: Moment
  estimatedBalance: number
  actualBalance: number
  balanceDifference: number
}
