import { DatePipe, DecimalPipe } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { MatDivider } from '@angular/material/divider'
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion'
import { MatIcon } from '@angular/material/icon'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { BalanceTableComponent } from '@components/balances/balance-table/balance-table.component'
import { ExpenseTableComponent } from '@components/expenses/expense-table/expense-table.component'
import { RevenueTableComponent } from '@components/revenues/revenue-table/revenue-table.component'
import { FinanceService } from '@services/finance.service'
import { SideBarOptions, SideBarService } from '@services/side-bar.service'
import { Subscription } from 'rxjs'

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
export class SidebarComponent implements OnInit, OnDestroy {
  financeService = inject(FinanceService)
  sideBarService = inject(SideBarService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  private routeFragmentSubscription: Subscription | null = null

  ngOnInit() {
    this.routeFragmentSubscription = this.route.fragment.subscribe(
      (fragment) => {
        if (this.router.url.split('/').length - 1 > 3) {
          const resource = this.router.url.split('/')[2]
          if (resource) {
            this.sideBarService.setExpanded(resource as SideBarOptions)
            return
          }
        }

        if (!fragment) {
          return
        }

        this.sideBarService.setExpanded(fragment as SideBarOptions)
      },
    )
  }

  ngOnDestroy() {
    this.routeFragmentSubscription?.unsubscribe()
  }
}
