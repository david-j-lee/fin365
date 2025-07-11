import { Injectable } from '@angular/core'
import { Budget } from '@interfaces/budgets/budget.interface'

@Injectable({ providedIn: 'root' })
export class FinanceService {
  budgets: Budget[] | null = null
  budget: Budget | null = null
  isLoaded = false

  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly']

  selectBudget(budget: Budget | null) {
    this.budget = budget
  }

  getFirstDate() {
    return this.budget?.days ? this.budget?.days[0]?.date : null
  }

  getMostRecentSnapshotDate() {
    if (!this.budget?.snapshots || this.budget.snapshots.length === 0) {
      return null
    }

    return this.budget.snapshots[0].date
  }
}
