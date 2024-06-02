import { Injectable } from '@angular/core'
import { ExpenseAdd } from '@interfaces/expenses/expense-add.interface'
import { ExpenseEdit } from '@interfaces/expenses/expense-edit.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageExpenseService } from '@services/local-storage/local-storage.expense.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageExpenseService'

@Injectable()
export class DalExpenseService {
  constructor(
    private localStorageExpenseService: LocalStorageExpenseService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
  ) {
    // Inject services
  }

  getAll(budgetId: string): Observable<Expense[]> {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  add(value: ExpenseAdd): Observable<Expense> {
    return this[SERVICE].add(value).pipe(
      map((result) => {
        const newExpense: Expense = {
          id: result,
          budgetId: value.budgetId,
          description: value.description,
          amount: value.amount,
          isForever: value.isForever,
          frequency: value.frequency,
          startDate: value.startDate,
          endDate: value.endDate,
          repeatMon: value.repeatMon,
          repeatTue: value.repeatTue,
          repeatWed: value.repeatWed,
          repeatThu: value.repeatThu,
          repeatFri: value.repeatFri,
          repeatSat: value.repeatSat,
          repeatSun: value.repeatSun,
          yearlyAmount: 0,
          dailyExpenses: [],
        }

        if (this.financeService.selectedBudget?.expenses) {
          this.financeService.selectedBudget.expenses.push(newExpense)
        }

        this.dailyService.generateExpense(newExpense)
        newExpense.yearlyAmount = this.dailyService.getTotalExpense(newExpense)

        this.dailyService.setRunningTotals()
        this.chartService.setChartExpense()
        this.chartService.setChartBudget()

        return newExpense
      }),
    )
  }

  update(oldExpense: Expense, newExpense: ExpenseEdit): Observable<Expense> {
    newExpense.id = oldExpense.id
    return this[SERVICE].update(newExpense).pipe(
      map(() => {
        oldExpense.description = newExpense.description
        oldExpense.amount = newExpense.amount
        oldExpense.isForever = newExpense.isForever
        oldExpense.frequency = newExpense.frequency
        oldExpense.startDate = newExpense.startDate
        oldExpense.endDate = newExpense.endDate
        oldExpense.repeatMon = newExpense.repeatMon
        oldExpense.repeatTue = newExpense.repeatTue
        oldExpense.repeatWed = newExpense.repeatWed
        oldExpense.repeatThu = newExpense.repeatThu
        oldExpense.repeatFri = newExpense.repeatFri
        oldExpense.repeatSat = newExpense.repeatSat
        oldExpense.repeatSun = newExpense.repeatSun

        this.dailyService.deleteExpense(oldExpense)
        this.dailyService.generateExpense(oldExpense)
        oldExpense.yearlyAmount = this.dailyService.getTotalExpense(oldExpense)
        this.dailyService.setRunningTotals()
        this.chartService.setChartExpense()
        this.chartService.setChartBudget()

        return oldExpense
      }),
    )
  }

  delete(id: string): Observable<boolean> {
    return this[SERVICE].delete(id).pipe(
      map(() => {
        if (
          this.financeService.selectedBudget &&
          this.financeService.selectedBudget.expenses
        ) {
          const deletedExpense =
            this.financeService.selectedBudget.expenses.find(
              (data) => data.id === id,
            )
          if (deletedExpense) {
            this.financeService.selectedBudget.expenses.splice(
              this.financeService.selectedBudget.expenses.indexOf(
                deletedExpense,
              ),
              1,
            )

            this.dailyService.deleteExpense(deletedExpense)
            this.dailyService.setRunningTotals()
            this.chartService.setChartExpense()
            this.chartService.setChartBudget()

            return true
          }
        }
        return false
      }),
    )
  }
}
