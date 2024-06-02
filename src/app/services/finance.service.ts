import { Injectable } from '@angular/core'
import { Budget } from '@interfaces/budgets/budget.interface'

@Injectable()
export class FinanceService {
  budgets: Budget[] | null = null
  selectedBudget: Budget | null = null
  isLoaded = false

  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly']

  selectBudget(budget: Budget) {
    this.selectedBudget = budget
  }

  getFirstDate() {
    return this.selectedBudget?.days ? this.selectedBudget?.days[0]?.date : null
  }

  getMostRecentSnapshotDate() {
    if (
      !this.selectedBudget?.snapshots ||
      this.selectedBudget.snapshots.length === 0
    ) {
      return null
    }

    return this.selectedBudget.snapshots[0].date
  }
}
