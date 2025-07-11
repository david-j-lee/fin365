import { Component, inject } from '@angular/core'
import { MatList, MatListItem } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  imports: [MatList, MatListItem, RouterLink, SortByPipe],
})
export class BalanceTableComponent {
  financeService = inject(FinanceService)
}
