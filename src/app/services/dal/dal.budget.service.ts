import { Injectable } from '@angular/core'
import { LocalStorageBudgetService } from '@data/local-storage/local-storage.budget'
import { BudgetAdd } from '@interfaces/budget-add.interface'
import { BudgetEdit } from '@interfaces/budget-edit.interface'
import { Budget } from '@interfaces/budget.interface'
import { Snapshot } from '@interfaces/snapshot.interface'
import moment from 'moment'

const SERVICE = 'localStorageBudgetService'

@Injectable()
export class DalBudgetService {
  private localStorageBudgetService = LocalStorageBudgetService

  async getAll(): Promise<Budget[]> {
    const budgets = await this[SERVICE].getAll()
    return budgets.map((budget) => ({
      ...budget,
      startDate: moment(budget.startDate),
      isBalancesLoaded: false,
      isRevenuesLoaded: false,
      isExpensesLoaded: false,
      isSnapshotsLoaded: false,
      balances: [],
      revenues: [],
      expenses: [],
      savings: [],
      snapshots: [],
      days: [],
    }))
  }

  async add(budgetAdd: BudgetAdd): Promise<[Budget, Snapshot]> {
    const result = await this[SERVICE].add(budgetAdd)
    const newBudget: Budget = {
      ...result.budget,
      isActive: true,
      startDate: moment(budgetAdd.startDate),
      isBalancesLoaded: true,
      isRevenuesLoaded: true,
      isExpensesLoaded: true,
      isSnapshotsLoaded: true,
      balances: [],
      revenues: [],
      expenses: [],
      savings: [],
      snapshots: [],
      days: [],
    }
    const newSnapshot: Snapshot = {
      ...result.snapshot,
      date: moment(budgetAdd.startDate),
      balanceDifference: 0,
    }
    return [newBudget, newSnapshot]
  }

  async update(budgetOriginal: Budget, budgetNew: BudgetEdit): Promise<Budget> {
    budgetNew.id = budgetOriginal.id
    const result = await this[SERVICE].update(budgetNew)
    if (!result) {
      return budgetOriginal
    }
    return {
      ...budgetOriginal,
      ...result,
      startDate: moment(result.startDate),
    }
  }

  async delete(id: string): Promise<boolean> {
    return await this[SERVICE].delete(id)
  }
}
