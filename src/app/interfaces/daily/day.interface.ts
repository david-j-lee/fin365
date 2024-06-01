import { DailyBalance } from '@interfaces/daily/daily-balance.interface'
import { DailyExpense } from '@interfaces/daily/daily-expense.interface'
import { DailyRevenue } from '@interfaces/daily/daily-revenue.interface'
import { Moment } from 'moment'

export interface Day {
  date: Moment
  month: number
  year: number

  dailyBalances: DailyBalance[]
  dailyRevenues: DailyRevenue[]
  dailyExpenses: DailyExpense[]

  totalBalance: number
  totalRevenue: number
  totalExpense: number
  balance: number
}
