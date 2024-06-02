import { Injectable } from '@angular/core'

@Injectable()
export class SideBarService {
  isBalancesExpanded = true
  isRevenuesExpanded = false
  isExpensesExpanded = false

  setExpanded(type: string) {
    if (!type) {
      return
    }

    switch (type) {
      case 'balance':
        this.isBalancesExpanded = true
        this.isExpensesExpanded = false
        this.isRevenuesExpanded = false
        break
      case 'expense':
        this.isBalancesExpanded = false
        this.isExpensesExpanded = true
        this.isRevenuesExpanded = false
        break
      case 'revenue':
        this.isBalancesExpanded = false
        this.isExpensesExpanded = false
        this.isRevenuesExpanded = true
        break
      default:
        console.error(`Encountered an supported ${type}`)
        break
    }
  }
}
