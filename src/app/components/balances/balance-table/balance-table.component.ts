import { Component } from '@angular/core'
import { MatList, MatListItem } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  imports: [MatList, MatListItem, RouterLink],
})
export class BalanceTableComponent {
  constructor(public financeService: FinanceService) {
    // Inject
  }
}
