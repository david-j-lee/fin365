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

  getMostRecentSnapshotDate() {
    if (
      !this.selectedBudget?.snapshots ||
      this.selectedBudget.snapshots.length === 0
    ) {
      return null;
    }

    return this.selectedBudget.snapshots[0].date;
  }
}
