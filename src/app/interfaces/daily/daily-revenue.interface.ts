import { Revenue } from '@interfaces/revenues/revenue.interface'
import { Day } from '@interfaces/daily/day.interface'

export interface DailyRevenue {
  day: Day
  revenue: Revenue
  amount: number
}
