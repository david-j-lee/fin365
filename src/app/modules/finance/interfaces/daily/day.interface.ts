import { Moment } from 'moment';

import { DailyBalance } from '../daily/daily-balance.interface';
import { DailyExpense } from '../daily/daily-expense.interface';
import { DailyRevenue } from '../daily/daily-revenue.interface';

export interface Day {
    date: Moment;
    month: number;
    year: number;

    dailyBalances: DailyBalance[];
    dailyRevenues: DailyRevenue[];
    dailyExpenses: DailyExpense[];

    totalBalance: number;
    totalRevenue: number;
    totalExpense: number;
    balance: number;
}
