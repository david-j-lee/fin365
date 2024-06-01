import { Balance } from '@interfaces/balances/balance.interface'
import { Day } from '@interfaces/daily/day.interface'

export interface DailyBalance {
  day: Day
  balance: Balance
  amount: number
}
