import { NgFor } from '@angular/common'
import { Component } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatList, MatListItem } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
    selector: 'app-expense-table',
    templateUrl: 'expense-table.component.html',
    imports: [
        MatList,
        NgFor,
        MatListItem,
        MatIconButton,
        RouterLink,
        MatIcon,
        SortByPipe,
    ]
})
export class ExpenseTableComponent {
  constructor(public financeService: FinanceService) {
    // Inject
  }
}
