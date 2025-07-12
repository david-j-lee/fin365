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
import { Budget } from '@interfaces/budgets/budget.interface'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DalRepeatableRuleService } from '@services/dal/dal.repeatable-rule.service'
import { DalRuleService } from '@services/dal/dal.rule.service'
import { DalSnapshotService } from '@services/dal/dal.snapshot.service'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'
import { isRepeatableRuleArray } from '@utilities/rule-utilities'
import moment from 'moment'

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
  private activatedRoute = inject(ActivatedRoute)
  private dalRuleService = inject(DalRuleService)
  private dalRepeatableRuleService = inject(DalRepeatableRuleService)
  private dalSnapshotService = inject(DalSnapshotService)
  private chartService = inject(ChartService)
  private sideBarService = inject(SideBarService)
  private calendarService = inject(CalendarService)

  budgetId: string | null = null
  type = ''

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.budgetId = params['budgetId']
      if (this.router.url.split('/').length - 1 > 3) {
        this.type = this.router.url.split('/')[2]
      }
      this.selectBudget()
    })
  }

  ngOnDestroy() {
    this.budgetId = null
    this.selectBudget()
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

    if (!budget.isBalancesLoaded) {
      this.sideBarService.setExpanded(this.type)
      this.getBalances(budget)
    }
    if (!budget.isExpensesLoaded) {
      this.sideBarService.setExpanded(this.type)
      this.getExpenses(budget)
    }
    if (!budget.isRevenuesLoaded) {
      this.sideBarService.setExpanded(this.type)
      this.getRevenues(budget)
    }
    if (!budget.isSnapshotsLoaded) {
      this.getSnapshots(budget)
    }

    this.financeService.generateBudget()
    this.chartService.setChartBalance()
    this.chartService.setChartRevenue()
    this.chartService.setChartExpense()
    this.chartService.setChartBudget()
    this.calendarService.setFirstMonth()
  }

  private getBalances(budget: Budget) {
    this.dalRuleService.getAll('balances', budget.id).subscribe({
      next: (result) => {
        if (result) {
          budget.balances = result
          budget.isBalancesLoaded = true
          this.checkData(budget)
        }
      },
      error: () => {
        budget.balances = []
      },
    })
  }

  private getExpenses(budget: Budget) {
    this.dalRepeatableRuleService.getAll('expenses', budget.id).subscribe({
      next: (result) => {
        if (result && isRepeatableRuleArray(result)) {
          const rawItems = result
          for (const item of rawItems) {
            item.startDate =
              item.startDate === null ? null : moment(item.startDate)
            item.endDate = item.endDate === null ? null : moment(item.endDate)
          }
          budget.expenses = result
          budget.isExpensesLoaded = true
          this.checkData(budget)
        }
      },
      error: () => {
        budget.expenses = []
      },
    })
  }

  private getRevenues(budget: Budget) {
    this.dalRepeatableRuleService.getAll('revenues', budget.id).subscribe({
      next: (result) => {
        if (result) {
          const rawItems = result
          for (const item of rawItems) {
            item.startDate =
              item.startDate === null ? null : moment(item.startDate)
            item.endDate = item.endDate === null ? null : moment(item.endDate)
          }
          budget.revenues = result
          budget.isRevenuesLoaded = true
          this.checkData(budget)
        }
      },
      error: () => {
        budget.revenues = []
      },
    })
  }

  private getSnapshots(budget: Budget) {
    this.dalSnapshotService.getAll(budget.id).subscribe({
      next: (result) => {
        if (result) {
          budget.snapshots = result
            .map((snapshot) => ({
              ...snapshot,
              date: moment(snapshot.date),
              balanceDifference:
                snapshot.actualBalance - snapshot.estimatedBalance,
            }))
            .sort((a, b) => {
              const valueA = a.date ? a.date.toISOString() : ''
              const valueB = b.date ? b.date.toISOString() : ''
              return valueB.localeCompare(valueA)
            })
          if (budget.snapshots && budget.snapshots[0]) {
            budget.startDate = budget.snapshots[0].date
          }
          budget.isSnapshotsLoaded = true
          this.checkData(budget)
        }
      },
      error: () => {
        budget.revenues = []
      },
    })
  }

  private checkData(budget: Budget) {
    if (
      budget.isBalancesLoaded &&
      budget.isExpensesLoaded &&
      budget.isRevenuesLoaded &&
      budget.isSnapshotsLoaded
    ) {
      this.financeService.generateBudget()
      this.chartService.setChartBalance()
      this.chartService.setChartExpense()
      this.chartService.setChartRevenue()
      this.chartService.setChartBudget()
      this.calendarService.setFirstMonth()
    }
  }
}
