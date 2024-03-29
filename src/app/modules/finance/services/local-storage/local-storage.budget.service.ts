import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BudgetAdd } from '../../interfaces/budgets/budget-add.interface';
import { BudgetEdit } from '../../interfaces/budgets/budget-edit.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { localStorageService } from 'src/app/core/utilities/local-storage-utilities';
import * as moment from 'moment';

@Injectable()
export class LocalStorageBudgetService {
  getAll(): Observable<Object> {
    const budgets: Object = localStorageService.getObject('budgets');
    return of(Object.values(budgets));
  }

  add(value: BudgetAdd) {
    const budgets: any = localStorageService.getObject('budgets');
    const budgetId = getRansomStringFromObject(budgets);
    const budgetResponse: any = {
      ...value,
      id: budgetId,
      isActive: true,
    };
    budgets[budgetResponse.id] = budgetResponse;
    localStorageService.setObject('budgets', budgets);

    const snapshots: any = localStorageService.getObject('snapshots');
    const snapshotId = getRansomStringFromObject(snapshots);
    const snapshotResponse: any = {
      id: snapshotId,
      date: value.startDate,
      actualBalance: 0,
      estimatedBalance: 0,
      budgetId,
    };
    snapshots[snapshotResponse.id] = snapshotResponse;
    localStorageService.setObject('snapshots', snapshots);

    return of({ budgetId, snapshotId });
  }

  update(value: BudgetEdit) {
    const budgets: any = localStorageService.getObject('budgets');
    if (budgets[value.id]) {
      const budget = budgets[value.id];
      budget.name = value.name;
      budget.isActive = value.isActive;
      localStorageService.setObject('budgets', budgets);
      return of(budget);
    }
    return of(false);
  }

  delete(id: number | string) {
    const budgets: any = localStorageService.getObject('budgets');
    if (budgets[id]) {
      delete budgets[id];
      localStorageService.setObject('budgets', budgets);

      const balances = localStorageService.getObject('balances');
      const filteredBalances = Object.fromEntries(
        Object.entries(balances).filter(
          ([_key, value]: [string, any]) => value.budgetId !== id
        )
      );
      localStorageService.setObject('balances', filteredBalances);

      const revenues = localStorageService.getObject('revenues');
      const filteredRevenues = Object.fromEntries(
        Object.entries(revenues).filter(
          ([_key, value]: [string, any]) => value.budgetId !== id
        )
      );
      localStorageService.setObject('revenues', filteredRevenues);

      const expenses = localStorageService.getObject('expenses');
      const filteredExpenses = Object.fromEntries(
        Object.entries(expenses).filter(
          ([_key, value]: [string, any]) => value.budgetId !== id
        )
      );
      localStorageService.setObject('expenses', filteredExpenses);

      const snapshots = localStorageService.getObject('snapshots');
      const filteredSnapshots = Object.fromEntries(
        Object.entries(snapshots).filter(
          ([_key, value]: [string, any]) => value.budgetId !== id
        )
      );
      localStorageService.setObject('snapshots', filteredSnapshots);

      return of(true);
    }
    return of(false);
  }
}
