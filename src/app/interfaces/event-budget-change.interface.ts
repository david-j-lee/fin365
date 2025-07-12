import { Budget } from '@interfaces/budget.interface'

export interface EventBudgetChange {
  resource: 'budget'
  event: 'add' | 'update' | 'delete' | 'select'
  budget: Budget
}
