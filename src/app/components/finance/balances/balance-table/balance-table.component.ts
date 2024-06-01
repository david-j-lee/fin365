import { NgFor } from '@angular/common'
import { Component } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatListItem, MatList } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  styleUrls: ['balance-table.component.scss'],
  standalone: true,
  imports: [MatList, NgFor, MatListItem, MatIconButton, RouterLink, MatIcon],
})
export class BalanceTableComponent {
  constructor(public financeService: FinanceService) {}
}
