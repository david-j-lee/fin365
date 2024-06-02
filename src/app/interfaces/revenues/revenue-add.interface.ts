import { Moment } from 'moment'

export interface RevenueAdd {
  budgetId: string

  description: string
  amount: number

  isForever: boolean
  frequency: string

  startDate: Moment | undefined
  endDate: Moment | undefined

  repeatMon: boolean
  repeatTue: boolean
  repeatWed: boolean
  repeatThu: boolean
  repeatFri: boolean
  repeatSat: boolean
  repeatSun: boolean
}
