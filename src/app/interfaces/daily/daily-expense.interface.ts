import { Expense } from '@interfaces/expenses/expense.interface'
import { Day } from '@interfaces/daily/day.interface'

export interface DailyExpense {
  day: Day
  expense: Expense
  amount: number
}
