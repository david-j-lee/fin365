import { Injectable } from '@angular/core';
import { Budget } from '../interfaces/budgets/budget.interface';

@Injectable()
export class FinanceService {
  budgets: Budget[] | undefined;
  selectedBudget: Budget | undefined;
  isLoaded = false;

  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly'];

  constructor() {}

  selectBudget(budget: Budget) {
    this.selectedBudget = budget;
  }
}
