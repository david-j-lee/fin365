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
  ) {
    // Inject services
  }

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

        if (this.financeService.selectedBudget?.balances) {
          this.financeService.selectedBudget.balances.push(newBalance)
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
