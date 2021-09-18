/*
This service handles all the calls to the WebAPI for snapshots
*/

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebApiSnapshotService } from '../web-api/web-api.snapshot.service';
import { FinanceService } from '../finance.service';
import { DailyService } from '../daily.service';
import { CalendarService } from '../calendar.service';
import { ChartService } from '../chart.service';

import { Snapshot } from '../../interfaces/snapshots/snapshot.interface';
import { SnapshotAdd } from '../../interfaces/snapshots/snapshot-add.interface';
import { SnapshotAddAll } from '../../interfaces/snapshots/snapshot-add-all.interface';
import { Balance } from '../../interfaces/balances/balance.interface';
import { LocalStorageSnapshotService } from '../local-storage/local-storage.snapshot.service';
import * as moment from 'moment';

const SERVICE = 'localStorageSnapshotService';

@Injectable()
export class DalSnapshotService {
  constructor(
    private localStorageSnapshotService: LocalStorageSnapshotService,
    private webApiSnapshotService: WebApiSnapshotService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private calendarService: CalendarService
  ) {}

  getAll(budgetId: number | string) {
    return this[SERVICE].getAll(budgetId).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  save(addSnapshot: SnapshotAdd, balances: Array<Balance>) {
    // calculate balances
    const newAddSnapshot = {
      date: addSnapshot.date.format('L'),
      estimatedBalance: this.dailyService.getBalanceForGivenDay(
        addSnapshot.date.format('L')
      ),
      actualBalance: balances
        .filter((x) => x.id !== undefined)
        .reduce((sum, item) => sum + item.amount, 0),
    };

    // wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId: this.financeService.selectedBudget?.id,
      snapshot: newAddSnapshot,
      snapshotBalances: balances.filter((x) => x.id !== undefined),
    };

    return this[SERVICE].save(snapshotAddAll).pipe(
      map((result: any) => {
        // add snapshot to local data
        const snapshot: Snapshot = {
          id: result.snapshotId,
          date: moment(addSnapshot.date),
          estimatedBalance: newAddSnapshot.estimatedBalance,
          actualBalance: newAddSnapshot.actualBalance,
          balanceDifference:
            newAddSnapshot.estimatedBalance - newAddSnapshot.actualBalance,
        };

        // update balances in local data
        let newBalanceIndex = 0;
        const newBalances: Balance[] = [];
        balances
          .filter((x) => x.id !== undefined)
          .forEach((balance) => {
            let balanceId = 0;
            if (balance.id === 0) {
              balanceId = result.balanceIds[newBalanceIndex];
              newBalanceIndex++;
            }
            const newBalance: Balance = {
              id: balanceId,
              description: balance.description,
              amount: balance.amount,
            };
            newBalances.push(newBalance);
          });

        if (this.financeService.selectedBudget) {
          this.financeService.selectedBudget.startDate = snapshot.date;
          this.financeService.selectedBudget.snapshots?.unshift(snapshot);
          this.financeService.selectedBudget.balances = newBalances;
        }

        this.dailyService.generateDailyBudget();
        this.chartService.setChartBalance();
        this.chartService.setChartExpense();
        this.chartService.setChartRevenue();
        this.chartService.setChartBudget();
        this.calendarService.setFirstMonth();

        return of(true);
      })
    );
  }

  delete(id: number | string) {}
}
