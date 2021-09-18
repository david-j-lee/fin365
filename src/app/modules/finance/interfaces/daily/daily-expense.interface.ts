import { Day } from '../daily/day.interface';
import { Expense } from '../expenses/expense.interface';

export interface DailyExpense {
    day: Day;
    expense: Expense;
    amount: number;
}
