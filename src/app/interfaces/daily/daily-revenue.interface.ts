import { Day } from '@interfaces/daily/day.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'

export interface DailyRevenue {
  day: Day
  revenue: Revenue
  amount: number
}
