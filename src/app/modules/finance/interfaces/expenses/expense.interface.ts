import { Moment } from 'moment';

import { DailyExpense } from '../daily/daily-expense.interface';

export interface Expense {
  id: number | string;

  description: string;
  amount: number;

  isForever: boolean;
  frequency: string;

  startDate: Moment;
  endDate: Moment;

  repeatMon: boolean;
  repeatTue: boolean;
  repeatWed: boolean;
  repeatThu: boolean;
  repeatFri: boolean;
  repeatSat: boolean;
  repeatSun: boolean;

  yearlyAmount: number;

  dailyExpenses: DailyExpense[];
}
