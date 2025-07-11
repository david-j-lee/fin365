import { Injectable, inject } from '@angular/core'
import { BudgetAdd } from '@interfaces/budgets/budget-add.interface'
import { BudgetEdit } from '@interfaces/budgets/budget-edit.interface'
import { Budget } from '@interfaces/budgets/budget.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageBudgetService } from '@storage/local-storage/local-storage.budget'
import moment from 'moment'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageBudgetService'

@Injectable()
export class DalBudgetService {
  private localStorageBudgetService = LocalStorageBudgetService

  private financeService = inject(FinanceService)
  private chartService = inject(ChartService)
  private dailyService = inject(DailyService)
  private calendarService = inject(CalendarService)

  getAll(): Observable<Budget[]> {
    return this[SERVICE].getAll().pipe(
      map((result) =>
        result.map((budget) => ({
          ...budget,
          startDate: moment(budget.startDate),
        })),
      ),
    )
  }

  add(value: BudgetAdd): Observable<Budget> {
    return this[SERVICE].add(value).pipe(
      map((result) => {
        const newBudget: Budget = {
          id: result.budgetId,
          isBalancesLoaded: true,
          isRevenuesLoaded: true,
          isExpensesLoaded: true,
          isSnapshotsLoaded: true,
          name: value.name,
          startDate: moment(value.startDate),
          isActive: true,
          balances: [],
          revenues: [],
          expenses: [],
          snapshots: [],
          days: [],
        }
        this.financeService.budgets?.push(newBudget)
        this.financeService.selectBudget(newBudget)
        this.dailyService.generateDailyBudget()
        this.chartService.setChartBalance()
        this.chartService.setChartRevenue()
        this.chartService.setChartExpense()
        this.chartService.setChartBudget()
        this.calendarService.setFirstMonth()

        const newSnapshot: Snapshot = {
          id: result.snapshotId,
          date: value.startDate,
          actualBalance: 0,
          estimatedBalance: 0,
          balanceDifference: 0,
          budgetId: newBudget.id,
        }

        if (this.financeService.budget?.snapshots) {
          this.financeService.budget.snapshots.push(newSnapshot)
        }

        return newBudget
      }),
    )
  }

  update(oldBudget: Budget, newBudget: BudgetEdit): Observable<Budget> {
    newBudget.id = oldBudget.id
    return this[SERVICE].update(newBudget).pipe(
      map(() => {
        oldBudget.name = newBudget.name

        // Update isActive and put into correct bucket
        if (oldBudget.isActive !== newBudget.isActive) {
          oldBudget.isActive = newBudget.isActive
          this.financeService.budgets = this.financeService.budgets
            ? [...this.financeService.budgets]
            : null
        }

        return oldBudget
      }),
    )
  }

  delete(id: string): Observable<boolean> {
    return this[SERVICE].delete(id).pipe(
      map(() => {
        if (this.financeService.budgets) {
          const deletedBudget = this.financeService.budgets.find(
            (data) => data.id === id,
          )
          if (deletedBudget) {
            this.financeService.budgets.splice(
              this.financeService.budgets.indexOf(deletedBudget),
              1,
            )
            return true
          }
        }
        return false
      }),
    )
  }
}
