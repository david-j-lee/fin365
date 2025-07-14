import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MatIcon } from '@angular/material/icon'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router'
import { BalancePieChartComponent } from '@components/balances/balance-pie-chart/balance-pie-chart.component'
import { BudgetChartComponent } from '@components/budgets/budget-chart/budget-chart.component'
import { CalendarComponent } from '@components/calendar/calendar.component'
import { ExpensePieChartComponent } from '@components/expenses/expense-pie-chart/expense-pie-chart.component'
import { RevenuePieChartComponent } from '@components/revenues/revenue-pie-chart/revenue-pie-chart.component'
import { SidebarComponent } from '@components/sidebar/sidebar.component'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss'],
  imports: [
    BalancePieChartComponent,
    BudgetChartComponent,
    CalendarComponent,
    ExpensePieChartComponent,
    MatIcon,
    MatTab,
    MatTabLabel,
    MatTabGroup,
    RevenuePieChartComponent,
    RouterOutlet,
    SidebarComponent,
  ],
})
export class BudgetDashboardComponent implements OnInit, OnDestroy {
  financeService = inject(FinanceService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private chartService = inject(ChartService)
  private sideBarService = inject(SideBarService)
  private calendarService = inject(CalendarService)

  private routeParamsSubscription: Subscription | null = null

  budgetId: string | null = null
  type = ''

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.budgetId = params['budgetId']
        if (this.router.url.split('/').length - 1 > 3) {
          this.type = this.router.url.split('/')[2]
        }
        this.selectBudget()
      },
    )
  }

  ngOnDestroy() {
    this.budgetId = null
    this.selectBudget()
    this.routeParamsSubscription?.unsubscribe()
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

    if (!budget.isBalancesLoaded()) {
      this.sideBarService.setExpanded(this.type)
    }
    if (!budget.isExpensesLoaded()) {
      this.sideBarService.setExpanded(this.type)
    }
    if (!budget.isRevenuesLoaded()) {
      this.sideBarService.setExpanded(this.type)
    }

    this.chartService.setChartBalance()
    this.chartService.setChartRevenue()
    this.chartService.setChartExpense()
    this.chartService.setChartBudget()
    this.calendarService.setFirstMonth()
  }
}
