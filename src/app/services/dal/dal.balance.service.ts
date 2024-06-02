/*
This service handles all the calls to the WebAPI for balances
*/
import { Injectable } from '@angular/core'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { BalanceEdit } from '@interfaces/balances/balance-edit.interface'
import { Balance } from '@interfaces/balances/balance.interface'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageBalanceService } from '@services/local-storage/local-storage.balance.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageBalanceService'

@Injectable()
export class DalBalanceService {
  constructor(
    private localStorageBalanceService: LocalStorageBalanceService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
  ) {}

  getAll(budgetId: string): Observable<Balance[]> {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  add(value: BalanceAdd): Observable<Balance> {
    const budgetId = this.financeService.selectedBudget?.id
    if (!budgetId) {
      throw new Error('Budget must be selected to add a Balance')
    }
    return this[SERVICE].add(value).pipe(
      map((result) => {
        // add new class locally
        const newBalance: Balance = {
          id: result,
          description: value.description,
          amount: value.amount,
          budgetId,
        }

        if (this.financeService.selectedBudget?.balances) {
          this.financeService.selectedBudget.balances.push(newBalance)
        }

        // generate daily data and update charts
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

        // update all
        this.dailyService.deleteBalance(oldBalance)
        this.dailyService.generateBalance(oldBalance)
        this.dailyService.setRunningTotals()
        this.chartService.setChartBalance()
        this.chartService.setChartBudget()

        return oldBalance
      }),
    )
  }

  delete(id: number | string): Observable<boolean> {
    return this[SERVICE].delete(id).pipe(
      map(() => {
        if (
          this.financeService.selectedBudget &&
          this.financeService.selectedBudget.balances
        ) {
          const deletedBalance =
            this.financeService.selectedBudget.balances.find(
              (data) => data.id === id,
            )
          if (deletedBalance) {
            this.financeService.selectedBudget.balances.splice(
              this.financeService.selectedBudget.balances.indexOf(
                deletedBalance,
              ),
              1,
            )

            // remove daily data and update charts
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
