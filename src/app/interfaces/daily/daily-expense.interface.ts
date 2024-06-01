import { Day } from '@interfaces/daily/day.interface'
import { Expense } from '@interfaces/expenses/expense.interface'

export interface DailyExpense {
  day: Day
  expense: Expense
  amount: number
}
