/*
This service handles all the calls to the WebAPI for snapshots
*/
import { Injectable } from '@angular/core'
import { Balance } from '@interfaces/balances/balance.interface'
import { SnapshotAddAll } from '@interfaces/snapshots/snapshot-add-all.interface'
import { SnapshotAdd } from '@interfaces/snapshots/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshots/snapshot-balance-add.interface'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageSnapshotService } from '@services/local-storage/local-storage.snapshot.service'
import moment from 'moment'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageSnapshotService'

@Injectable()
export class DalSnapshotService {
  constructor(
    private localStorageSnapshotService: LocalStorageSnapshotService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private calendarService: CalendarService,
  ) {}

  getAll(budgetId: number | string) {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  save(
    addSnapshot: SnapshotAdd,
    balances: Array<SnapshotBalanceAdd>,
  ): Observable<Snapshot> {
    if (!this.financeService.selectedBudget?.id) {
      throw new Error('Budget required to add snapshot')
    }

    const budgetId = this.financeService.selectedBudget.id

    // calculate balances
    const newAddSnapshot: SnapshotAdd = {
      date: addSnapshot.date,
      estimatedBalance: this.dailyService.getBalanceForGivenDay(
        addSnapshot.date.format('L'),
      ),
      actualBalance: balances
        .filter((x) => x.id !== undefined)
        .reduce((sum, item) => sum + item.amount, 0),
    }

    // wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId,
      snapshot: newAddSnapshot,
      snapshotBalances: balances.filter((x) => x.id !== undefined),
    }

    return this[SERVICE].save(snapshotAddAll).pipe(
      map((result) => {
        // add snapshot to local data
        const snapshot: Snapshot = {
          id: result.snapshotId,
          date: moment(addSnapshot.date),
          estimatedBalance: newAddSnapshot.estimatedBalance,
          actualBalance: newAddSnapshot.actualBalance,
          balanceDifference:
            newAddSnapshot.estimatedBalance - newAddSnapshot.actualBalance,
          budgetId,
        }

        // update balances in local data
        let newBalanceIndex = 0
        const newBalances: Balance[] = []
        balances
          .filter((x) => x.id !== undefined)
          .forEach((balance) => {
            let balanceId = '0'
            if (balance.id === '0') {
              balanceId = result.balanceIds[newBalanceIndex]
              newBalanceIndex++
            }
            const newBalance: Balance = {
              id: balanceId,
              description: balance.description,
              amount: balance.amount,
              budgetId,
            }
            newBalances.push(newBalance)
          })

        if (this.financeService.selectedBudget) {
          this.financeService.selectedBudget.startDate = snapshot.date
          this.financeService.selectedBudget.snapshots?.unshift(snapshot)
          this.financeService.selectedBudget.balances = newBalances
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
