import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ExpenseAdd } from '../../interfaces/expenses/expense-add.interface';
import { ExpenseEdit } from '../../interfaces/expenses/expense-edit.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { localStorageService } from 'src/app/core/utilities/local-storage-utilities';

@Injectable()
export class LocalStorageExpenseService {
  getAll(budgetId: number | string): Observable<Object> {
    const expenses = localStorageService.getObject('expenses');
    return of(
      Object.values(expenses).filter(
        (expense: any) => expense.budgetId === budgetId
      )
    );
  }

  add(value: ExpenseAdd) {
    const expenses = localStorageService.getObject('expenses');

    const id = getRansomStringFromObject(expenses);
    expenses[id] = { ...value, id };
    localStorageService.setObject('expenses', expenses);

    const response = id;

    return of(response);
  }

  update(value: ExpenseEdit) {
    const expenses = localStorageService.getObject('expenses');
    const expense = expenses[value.id];
    if (expense) {
      expense.description = value.description;
      expense.amount = value.amount;
      expense.isForever = value.isForever;
      expense.frequency = value.frequency;
      expense.startDate = value.startDate;
      expense.endDate = value.endDate;
      expense.repeatMon = value.repeatMon;
      expense.repeatTue = value.repeatTue;
      expense.repeatWed = value.repeatWed;
      expense.repeatThu = value.repeatThu;
      expense.repeatFri = value.repeatFri;
      expense.repeatSat = value.repeatSat;
      expense.repeatSun = value.repeatSun;
      localStorageService.setObject('expenses', expenses);
      return of(true);
    }
    return of(false);
  }

  delete(id: number | string) {
    const expenses = localStorageService.getObject('expenses');
    if (expenses[id]) {
      delete expenses[id];
      return of(true);
    }
    return of(false);
  }
}
