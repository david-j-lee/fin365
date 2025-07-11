import { Component } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatList, MatListItem } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-revenue-table',
  templateUrl: 'revenue-table.component.html',
  imports: [MatList, MatListItem, MatIconButton, RouterLink, MatIcon],
})
export class RevenueTableComponent {
  constructor(public financeService: FinanceService) {
    // Inject service
  }
}
