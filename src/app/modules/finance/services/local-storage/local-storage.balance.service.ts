import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BalanceAdd } from '../../interfaces/balances/balance-add.interface';
import { BalanceEdit } from '../../interfaces/balances/balance-edit.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { localStorageService } from 'src/app/core/utilities/local-storage-utilities';

@Injectable()
export class LocalStorageBalanceService {
  getAll(budgetId: number | string): Observable<Object> {
    const balances = localStorageService.getObject('balances');
    return of(
      Object.values(balances).filter(
        (balance: any) => balance.budgetId === budgetId
      )
    );
  }

  add(value: BalanceAdd) {
    const balances = localStorageService.getObject('balances');

    const id = getRansomStringFromObject(balances);
    balances[id] = { ...value, id };
    localStorageService.setObject('balances', balances);

    const response = id;

    return of(response);
  }

  update(value: BalanceEdit) {
    const balances = localStorageService.getObject('balances');
    const balance = balances[value.id];
    if (balance) {
      balance.description = value.description;
      balance.amount = value.amount;
      localStorageService.setObject('balances', balances);
      return of(true);
    }
    return of(false);
  }

  delete(id: number | string) {
    const balances = localStorageService.getObject('balances');
    if (balances[id]) {
      delete balances[id];
      return of(true);
    }
    return of(false);
  }
}
