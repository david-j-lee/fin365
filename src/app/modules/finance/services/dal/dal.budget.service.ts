/*
  This data access layer handles all the business logic after an webAPI call
*/

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorageBudgetService } from '../local-storage/local-storage.budget.service';
import { WebApiBudgetService } from '../web-api/web-api.budget.service';
import { DailyService } from '../daily.service';
import { CalendarService } from '../calendar.service';
import { ChartService } from '../chart.service';
import { FinanceService } from '../finance.service';

import { Budget } from '../../interfaces/budgets/budget.interface';
import { BudgetAdd } from '../..//interfaces/budgets/budget-add.interface';
import { BudgetEdit } from '../../interfaces/budgets/budget-edit.interface';
import { Snapshot } from '../../interfaces/snapshots/snapshot.interface';
import * as moment from 'moment';

const SERVICE = 'localStorageBudgetService';

@Injectable()
export class DalBudgetService {
  constructor(
    private financeService: FinanceService,
    private chartService: ChartService,
    private dailyService: DailyService,
    private calendarService: CalendarService,
    private webApiBudgetService: WebApiBudgetService,
    private localStorageBudgetService: LocalStorageBudgetService
  ) {}

  getAll(): Observable<any> {
    return this[SERVICE].getAll().pipe(
      map((result: any) => {
        return result.map((budget: any) => ({
          ...budget,
          startDate: moment(budget.startDate),
        }));
      })
    );
  }

  add(value: BudgetAdd): Observable<any> {
    return this[SERVICE].add(value).pipe(
      map((result: any) => {
        // add new class locally
        const newBudget: Budget = {
          id: result.id,
          isBalancesLoaded: true,
          isRevenuesLoaded: true,
          isExpensesLoaded: true,
          isSnapshotsLoaded: true,
          name: value.name,
          startDate: value.startDate,
          isActive: true,
          balances: [],
          revenues: [],
          expenses: [],
          snapshots: [],
          days: [],
        };
        this.financeService.budgets?.push(newBudget);
        this.financeService.selectBudget(newBudget);
        this.dailyService.generateDailyBudget();
        this.chartService.setChartBalance();
        this.chartService.setChartRevenue();
        this.chartService.setChartExpense();
        this.chartService.setChartBudget();
        this.calendarService.setFirstMonth();

        // add new snapshot
        const newSnapshot: Snapshot = {
          id: result.snapshotId,
          date: value.startDate,
          actualBalance: 0,
          estimatedBalance: 0,
          balanceDifference: 0,
        };
        if (this.financeService.selectedBudget?.snapshots) {
          this.financeService.selectedBudget.snapshots.push(newSnapshot);
        }
      })
    );
  }

  update(oldBudget: Budget, newBudget: BudgetEdit): Observable<any> {
    newBudget.id = oldBudget.id;
    return this[SERVICE].update(newBudget).pipe(
      map((_result: any) => {
        oldBudget.name = newBudget.name;

        // update isActive and put into correct bucket
        if (oldBudget.isActive !== newBudget.isActive) {
          oldBudget.isActive = newBudget.isActive;
          this.financeService.budgets = this.financeService.budgets;
        }

        return of(true);
      })
    );
  }

  delete(id: number | string): Observable<any> {
    return this[SERVICE].delete(id).pipe(
      map((_result: any) => {
        if (this.financeService.budgets) {
          const deletedBudget = this.financeService.budgets.find(
            (data: any) => data.id === id
          );
          if (deletedBudget) {
            this.financeService.budgets.splice(
              this.financeService.budgets.indexOf(deletedBudget),
              1
            );
            return of(true);
          }
          return throwError(false);
        }
        return throwError(false);
      })
    );
  }
}
