import { Day } from '../daily/day.interface';
import { Balance } from '../balances/balance.interface';

export interface DailyBalance {
    day: Day;
    balance: Balance;
    amount: number;
}
