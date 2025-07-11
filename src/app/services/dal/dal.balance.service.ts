import { Injectable, inject } from '@angular/core'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { BalanceEdit } from '@interfaces/balances/balance-edit.interface'
import { Balance } from '@interfaces/balances/balance.interface'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageBalanceService } from '@storage/local-storage/local-storage.balance'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageBalanceService'

@Injectable()
export class DalBalanceService {
  private localStorageBalanceService = LocalStorageBalanceService

  private financeService = inject(FinanceService)
  private dailyService = inject(DailyService)
  private chartService = inject(ChartService)

  getAll(budgetId: string): Observable<Balance[]> {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  add(value: BalanceAdd): Observable<Balance> {
    return this[SERVICE].add(value).pipe(
      map((result) => {
        const newBalance: Balance = {
          id: result,
          description: value.description,
          amount: value.amount,
          budgetId: value.budgetId,
        }

        if (this.financeService.budget?.balances) {
          this.financeService.budget.balances.push(newBalance)
        }

        this.dailyService.generateBalance(newBalance)
        this.chartService.setChartBalance()
        this.chartService.setChartBudget()

        return newBalance
      }),
    )
  }

  update(oldBalance: Balance, newBalance: BalanceEdit): Observable<Balance> {
    newBalance.id = oldBalance.id
    return this[SERVICE].update(newBalance).pipe(
      map(() => {
        oldBalance.description = newBalance.description
        oldBalance.amount = newBalance.amount

        this.dailyService.deleteBalance(oldBalance)
        this.dailyService.generateBalance(oldBalance)
        this.dailyService.setRunningTotals()
        this.chartService.setChartBalance()
        this.chartService.setChartBudget()

        return oldBalance
      }),
    )
  }

  delete(id: string): Observable<boolean> {
    return this[SERVICE].delete(id).pipe(
      map(() => {
        if (this.financeService.budget && this.financeService.budget.balances) {
          const deletedBalance = this.financeService.budget.balances.find(
            (data) => data.id === id,
          )
          if (deletedBalance) {
            this.financeService.budget.balances.splice(
              this.financeService.budget.balances.indexOf(deletedBalance),
              1,
            )

            this.dailyService.deleteBalance(deletedBalance)
            this.dailyService.setRunningTotals()
            this.chartService.setChartBalance()
            this.chartService.setChartBudget()

            return true
          }
        }
        return false
      }),
    )
  }
}
