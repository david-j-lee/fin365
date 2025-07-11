import { Injectable, inject } from '@angular/core'
import { Balance } from '@interfaces/balances/balance.interface'
import { SnapshotAddAll } from '@interfaces/snapshots/snapshot-add-all.interface'
import { SnapshotAdd } from '@interfaces/snapshots/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshots/snapshot-balance-add.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageSnapshotService } from '@storage/local-storage/local-storage.snapshot'
import moment from 'moment'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageSnapshotService'

@Injectable()
export class DalSnapshotService {
  private localStorageSnapshotService = LocalStorageSnapshotService

  private financeService = inject(FinanceService)
  private dailyService = inject(DailyService)
  private chartService = inject(ChartService)
  private calendarService = inject(CalendarService)

  getAll(budgetId: string) {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  save(
    addSnapshot: SnapshotAdd,
    balances: SnapshotBalanceAdd[],
  ): Observable<Snapshot> {
    const { budgetId } = addSnapshot
    const filteredBalances = balances.filter((balance) => balance.id)

    // Calculate balances
    const newAddSnapshot: SnapshotAdd = {
      ...addSnapshot,
      estimatedBalance: this.dailyService.getBalanceForGivenDay(
        addSnapshot.date.format('L'),
      ),
      actualBalance: filteredBalances.reduce(
        (sum, item) => sum + item.amount,
        0,
      ),
    }

    // Wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId,
      snapshot: newAddSnapshot,
      snapshotBalances: filteredBalances,
    }

    return this[SERVICE].save(snapshotAddAll).pipe(
      map((result) => {
        // Add snapshot to local data
        const snapshot: Snapshot = {
          id: result.snapshotId,
          date: moment(addSnapshot.date),
          estimatedBalance: newAddSnapshot.estimatedBalance,
          actualBalance: newAddSnapshot.actualBalance,
          balanceDifference:
            newAddSnapshot.actualBalance - newAddSnapshot.estimatedBalance,
          budgetId,
        }

        // Update balances in local data
        let newBalanceIndex = 0
        const newBalances: Balance[] = []
        filteredBalances.forEach((balance) => {
          let balanceId = ''
          if (!balance.id) {
            balanceId = result.balanceIds[newBalanceIndex]
            newBalanceIndex += 1
          }
          const newBalance: Balance = {
            id: balanceId,
            description: balance.description,
            amount: balance.amount,
            budgetId,
          }
          newBalances.push(newBalance)
        })

        if (this.financeService.budget) {
          this.financeService.budget.startDate = snapshot.date
          this.financeService.budget.snapshots?.unshift(snapshot)
          this.financeService.budget.balances = newBalances
        }

        this.dailyService.generateDailyBudget()
        this.chartService.setChartBalance()
        this.chartService.setChartExpense()
        this.chartService.setChartRevenue()
        this.chartService.setChartBudget()
        this.calendarService.setFirstMonth()

        return snapshot
      }),
    )
  }
}
