import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BudgetAdd } from '../../interfaces/budgets/budget-add.interface';
import { BudgetEdit } from '../../interfaces/budgets/budget-edit.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { sessionStorageService } from 'src/app/core/utilities/local-storage-utilities';

@Injectable()
export class LocalStorageBudgetService {
  getAll(): Observable<Object> {
    const budgets: Object = sessionStorageService.getObject('budgets');
    return of(Object.values(budgets));
  }

  add(value: BudgetAdd) {
    const budgets: any = sessionStorageService.getObject('budgets');
    const id = getRansomStringFromObject(budgets);
    const response: any = {
      ...value,
      id,
      isActive: true,
    };
    budgets[response.id] = response;
    localStorage.setItem('budgets', JSON.stringify(budgets));

    // TODO: also need to add a snapshot

    return of(response);
  }

  update(value: BudgetEdit) {
    const budgets: any = sessionStorageService.getObject('budgets');
    if (budgets[value.id]) {
      const budget = budgets[value.id];
      budget.name = value.name;
      budget.isActive = value.isActive;
      localStorage.setItem('budgets', JSON.stringify(budgets));
      return of(budget);
    }
    return of(false);
  }

  delete(id: number | string) {
    const budgets: any = sessionStorageService.getObject('budgets');
    if (budgets[id]) {
      delete budgets[id];
      localStorage.setItem('budgets', JSON.stringify(budgets));
      return of(true);
    }
    return of(false);
  }
}
