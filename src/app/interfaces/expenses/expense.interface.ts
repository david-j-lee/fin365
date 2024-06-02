import { DailyExpense } from '@interfaces/daily/daily-expense.interface'
import { Moment } from 'moment'

export interface Expense {
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
  dailyExpenses?: DailyExpense[]
}
