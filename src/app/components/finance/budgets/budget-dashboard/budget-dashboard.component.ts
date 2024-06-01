import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router'
import { BalancePieChartComponent } from '@components/finance/balances/balance-pie-chart/balance-pie-chart.component'
import { BudgetChartComponent } from '@components/finance/budgets/budget-chart/budget-chart.component'
import { CalendarComponent } from '@components/finance/calendar/calendar.component'
import { ExpensePieChartComponent } from '@components/finance/expenses/expense-pie-chart/expense-pie-chart.component'
import { RevenuePieChartComponent } from '@components/finance/revenues/revenue-pie-chart/revenue-pie-chart.component'
import { SidebarComponent } from '@components/ui/sidebar/sidebar.component'
import { Budget } from '@interfaces/budgets/budget.interface'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { DalExpenseService } from '@services/dal/dal.expense.service'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { DalSnapshotService } from '@services/dal/dal.snapshot.service'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'
import moment from 'moment'

@Component({
  selector: 'app-budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    SidebarComponent,
    MatTabGroup,
    MatTab,
    BalancePieChartComponent,
    RevenuePieChartComponent,
    ExpensePieChartComponent,
    BudgetChartComponent,
    CalendarComponent,
    RouterOutlet,
  ],
})
export class BudgetDashboardComponent implements OnInit {
  budgetId: number | string | undefined
  type: string = ''

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dailyService: DailyService,
    private dalBalanceService: DalBalanceService,
    private dalExpenseService: DalExpenseService,
    private dalRevenueService: DalRevenueService,
    private dalSnapshotService: DalSnapshotService,
    private chartService: ChartService,
    private sideBarService: SideBarService,
    private calendarService: CalendarService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.budgetId = params['budgetId'] as number
      if (this.router.url.split('/').length - 1 > 3) {
        this.type = this.router.url.split('/')[2]
      }
      this.selectBudget()
    })
  }

  private selectBudget() {
    const selectedBudget = this.financeService.budgets?.find(
      (x) => x.id === this.budgetId,
    )
    if (selectedBudget) {
      this.financeService.selectBudget(selectedBudget)

      if (!selectedBudget.isBalancesLoaded) {
        this.sideBarService.setExpanded(this.type)
        this.getBalances(selectedBudget)
      }
      if (!selectedBudget.isExpensesLoaded) {
        this.sideBarService.setExpanded(this.type)
        this.getExpenses(selectedBudget)
      }
      if (!selectedBudget.isRevenuesLoaded) {
        this.sideBarService.setExpanded(this.type)
        this.getRevenues(selectedBudget)
      }
      if (!selectedBudget.isSnapshotsLoaded) {
        this.getSnapshots(selectedBudget)
      }

      this.dailyService.generateDailyBudget()
      this.chartService.setChartBalance()
      this.chartService.setChartRevenue()
      this.chartService.setChartExpense()
      this.chartService.setChartBudget()
      this.calendarService.setFirstMonth()
    }
  }

  private getBalances(budget: Budget) {
    this.dalBalanceService.getAll(budget.id).subscribe(
      (result) => {
        if (result) {
          budget.balances = result
          budget.isBalancesLoaded = true
          this.checkData(budget)
        }
      },
      () => {
        budget.balances = []
      },
    )
  }

  private getExpenses(budget: Budget) {
    this.dalExpenseService.getAll(budget.id).subscribe(
      (result) => {
        if (result) {
          const rawItems = result
          for (const item of rawItems) {
            item.startDate =
              item.startDate !== null ? moment(item.startDate) : ''
            item.endDate = item.endDate !== null ? moment(item.endDate) : ''
          }
          budget.expenses = result
          budget.isExpensesLoaded = true
          this.checkData(budget)
        }
      },
      () => {
        budget.expenses = []
      },
    )
  }

  private getRevenues(budget: Budget) {
    this.dalRevenueService.getAll(budget.id).subscribe(
      (result) => {
        if (result) {
          const rawItems = result
          for (const item of rawItems) {
            item.startDate =
              item.startDate !== null ? moment(item.startDate) : ''
            item.endDate = item.endDate !== null ? moment(item.endDate) : ''
          }
          budget.revenues = result
          budget.isRevenuesLoaded = true
          this.checkData(budget)
        }
      },
      () => {
        budget.revenues = []
      },
    )
  }

  private getSnapshots(budget: Budget) {
    this.dalSnapshotService.getAll(budget.id).subscribe(
      (result) => {
        if (result) {
          budget.snapshots = result
            .map((snapshot: any) => ({
              ...snapshot,
              date: snapshot.date !== null ? moment(snapshot.date) : '',
              balanceDifference:
                snapshot.estimatedBalance - snapshot.actualBalance,
            }))
            .sort((a: any, b: any) => {
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
      () => {
        budget.revenues = []
      },
    )
  }

  private checkData(budget: Budget) {
    if (
      budget.isBalancesLoaded &&
      budget.isExpensesLoaded &&
      budget.isRevenuesLoaded &&
      budget.isSnapshotsLoaded
    ) {
      this.dailyService.generateDailyBudget()
      this.chartService.setChartBalance()
      this.chartService.setChartExpense()
      this.chartService.setChartRevenue()
      this.chartService.setChartBudget()
      this.calendarService.setFirstMonth()
    }
  }
}
