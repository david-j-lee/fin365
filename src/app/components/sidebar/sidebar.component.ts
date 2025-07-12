import { DatePipe, DecimalPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { MatDivider } from '@angular/material/divider'
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion'
import { MatIcon } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { BalanceTableComponent } from '@components/balances/balance-table/balance-table.component'
import { ExpenseTableComponent } from '@components/expenses/expense-table/expense-table.component'
import { RevenueTableComponent } from '@components/revenues/revenue-table/revenue-table.component'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  imports: [
    BalanceTableComponent,
    DatePipe,
    DecimalPipe,
    ExpenseTableComponent,
    MatAccordion,
    MatButton,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    RevenueTableComponent,
    RouterLink,
  ],
})
export class SidebarComponent {
  financeService = inject(FinanceService)
  sideBarService = inject(SideBarService)
}
