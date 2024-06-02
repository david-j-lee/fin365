import { DailyRevenue } from '@interfaces/daily/daily-revenue.interface'
import { Moment } from 'moment'

export interface Revenue {
  id: string
  budgetId: string

  description: string
  amount: number

  isForever: boolean
  frequency: string

  startDate: Moment | null
  endDate: Moment | null

  repeatMon: boolean
  repeatTue: boolean
  repeatWed: boolean
  repeatThu: boolean
  repeatFri: boolean
  repeatSat: boolean
  repeatSun: boolean

  yearlyAmount?: number
  dailyRevenues?: DailyRevenue[]
}
