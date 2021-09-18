/*
This service handles all the calls to the WebAPI for balances
*/

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorageBalanceService } from '../local-storage/local-storage.balance.service';
import { WebApiBalanceService } from '../web-api/web-api.balance.service';
import { FinanceService } from '../finance.service';
import { DailyService } from '../daily.service';
import { ChartService } from '../chart.service';

import { Balance } from '../../interfaces/balances/balance.interface';
import { BalanceAdd } from '../../interfaces/balances/balance-add.interface';
import { BalanceEdit } from '../../interfaces/balances/balance-edit.interface';

const SERVICE = 'localStorageBalanceService';

@Injectable()
export class DalBalanceService {
  constructor(
    private localStorageBalanceService: LocalStorageBalanceService,
    private webApiBalanceService: WebApiBalanceService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService
  ) {}

  getAll(budgetId: number | string): Observable<any> {
    return this[SERVICE].getAll(budgetId).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  add(value: BalanceAdd): Observable<any> {
    return this[SERVICE].add(value).pipe(
      map((result: any) => {
        // add new class locally
        const newBalance: Balance = {
          id: result,
          description: value.description,
          amount: value.amount,
        };

        if (this.financeService.selectedBudget?.balances) {
          this.financeService.selectedBudget.balances.push(newBalance);
        }

        // generate daily data and update charts
        this.dailyService.generateBalance(newBalance);
        this.chartService.setChartBalance();
        this.chartService.setChartBudget();

        return of(true);
      })
    );
  }

  update(oldBalance: Balance, newBalance: BalanceEdit): Observable<any> {
    newBalance.id = oldBalance.id;
    return this[SERVICE].update(newBalance).pipe(
      map((_result: any) => {
        oldBalance.description = newBalance.description;
        oldBalance.amount = newBalance.amount;

        // update all
        this.dailyService.deleteBalance(oldBalance);
        this.dailyService.generateBalance(oldBalance);
        this.dailyService.setRunningTotals();
        this.chartService.setChartBalance();
        this.chartService.setChartBudget();

        return of(true);
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this[SERVICE].delete(id).pipe(
      map((_result: any) => {
        if (
          this.financeService.selectedBudget &&
          this.financeService.selectedBudget.balances
        ) {
          const deletedBalance =
            this.financeService.selectedBudget.balances.find(
              (data: any) => data.id === id
            );
          if (deletedBalance) {
            this.financeService.selectedBudget.balances.splice(
              this.financeService.selectedBudget.balances.indexOf(
                deletedBalance
              ),
              1
            );

            // remove daily data and update charts
            this.dailyService.deleteBalance(deletedBalance);
            this.dailyService.setRunningTotals();
            this.chartService.setChartBalance();
            this.chartService.setChartBudget();

            return of(true);
          }
          return throwError(false);
        }
        return throwError(false);
      })
    );
  }
}
