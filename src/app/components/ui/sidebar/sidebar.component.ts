import { DatePipe, DecimalPipe, NgIf } from '@angular/common'
import { Component } from '@angular/core'
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
import { BalanceTableComponent } from '@components/finance/balances/balance-table/balance-table.component'
import { ExpenseTableComponent } from '@components/finance/expenses/expense-table/expense-table.component'
import { RevenueTableComponent } from '@components/finance/revenues/revenue-table/revenue-table.component'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  standalone: true,
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
    NgIf,
    RevenueTableComponent,
    RouterLink,
  ],
})
export class SidebarComponent {
  constructor(
    public financeService: FinanceService,
    public dailyService: DailyService,
    public sideBarService: SideBarService,
  ) {}
}
