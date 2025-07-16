import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router'
import { BalanceDashboardComponent } from '@components/balances/balance-dashboard/balance-dashboard.component'
import { BudgetChartComponent } from '@components/budgets/budget-chart/budget-chart.component'
import { CalendarComponent } from '@components/calendar/calendar.component'
import { ExpenseDashboardComponent } from '@components/expenses/expense-dashboard/expense-dashboard.component'
import { RevenueDashboardComponent } from '@components/revenues/revenue-dashboard/revenue-dashboard.component'
import { SidebarComponent } from '@components/sidebar/sidebar.component'
import { tabs } from '@constants/budget.constants'
import { FinanceService } from '@services/finance.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss'],
  imports: [
    BalanceDashboardComponent,
    BudgetChartComponent,
    CalendarComponent,
    ExpenseDashboardComponent,
    MatTab,
    MatTabGroup,
    RevenueDashboardComponent,
    RouterOutlet,
    SidebarComponent,
  ],
})
export class BudgetDashboardComponent implements OnInit, OnDestroy {
  financeService = inject(FinanceService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  private routeParamsSubscription: Subscription | null = null
  private routeFragmentSubscription: Subscription | null = null

  private budgetId: string | null = null

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.budgetId = params['budgetId']
        this.selectBudget()
      },
    )

    this.routeFragmentSubscription = this.route.fragment.subscribe(
      (fragment) => {
        if (!fragment) {
          this.financeService.setTab(tabs[0])
          return
        }

        const tab = tabs.find((tab) => tab.key === fragment)
        if (!tab) {
          this.financeService.setTab(tabs[0])
          return
        }

        this.financeService.setTab(tab)
      },
    )
  }

  ngOnDestroy() {
    this.budgetId = null
    this.selectBudget()
    this.routeParamsSubscription?.unsubscribe()
    this.routeFragmentSubscription?.unsubscribe()
  }

  private selectBudget() {
    const budget = this.financeService.budgets?.find(
      (budget) => budget.id === this.budgetId,
    )

    if (!budget) {
      this.financeService.selectBudget(null)
      this.router.navigate(['/'])
      return
    }

    this.financeService.selectBudget(budget)
  }
}
