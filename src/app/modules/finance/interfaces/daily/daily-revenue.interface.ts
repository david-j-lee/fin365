import { Day } from '../daily/day.interface';
import { Revenue } from '../revenues/revenue.interface';

export interface DailyRevenue {
    day: Day;
    revenue: Revenue;
    amount: number;
}
