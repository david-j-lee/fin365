import { NgFor } from '@angular/common'
import { Component } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatList, MatListItem } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  standalone: true,
  imports: [MatList, NgFor, MatListItem, MatIconButton, RouterLink, MatIcon],
})
export class BalanceTableComponent {
  constructor(public financeService: FinanceService) {
    // Inject
  }
}
