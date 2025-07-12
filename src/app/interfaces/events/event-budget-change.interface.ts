import { Budget } from '@interfaces/budgets/budget.interface'

export interface EventBudgetChange {
  event: 'add' | 'update' | 'delete'
  budget: Budget
}
