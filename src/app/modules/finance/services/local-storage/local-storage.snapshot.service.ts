// public virtual int Id { get; set; }

//         public virtual DateTime? Date { get; set; }
//         public virtual double EstimatedBalance { get; set; }
//         public virtual double ActualBalance { get; set; }

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SnapshotAddAll } from '../../interfaces/snapshots/snapshot-add-all.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { localStorageService } from 'src/app/core/utilities/local-storage-utilities';
import * as moment from 'moment';

@Injectable()
export class LocalStorageSnapshotService {
  getAll(budgetId: number | string): Observable<Object> {
    const snapshots = localStorageService.getObject('snapshots');
    return of(
      Object.values(snapshots).filter(
        (snapshot: any) => snapshot.budgetId === budgetId
      )
    );
  }

  save(value: SnapshotAddAll) {
    // add a snapshot
    const snapshots = localStorageService.getObject('snapshots');
    const id = getRansomStringFromObject(snapshots);
    snapshots[id] = {
      ...value.snapshot,
      id,
      date: moment(value.snapshot.date, 'MM/DD/YYYY')
        .utcOffset(moment().utcOffset())
        .format(),
      budgetId: value.budgetId,
    };
    localStorageService.setObject('snapshots', snapshots);

    // remove and add new balances
    const balances = localStorageService.getObject('balances');
    const filteredBalances = Object.fromEntries(
      Object.entries(balances).filter(
        ([_id, balance]: [string, any]) => balance.budgetId !== value.budgetId
      )
    );
    value.snapshotBalances.forEach((balance: any) => {
      filteredBalances[balance.id] = { ...balance, budgetId: value.budgetId };
    });
    localStorageService.setObject('balances', filteredBalances);

    // update budget start date
    const budgets = localStorageService.getObject('budgets');
    const budget = budgets[value.budgetId ?? ''];
    if (budget) {
      budget.startDate = snapshots[id].date;
      localStorageService.setObject('budgets', budgets);
    }

    return of({
      snapshotId: id,
      balanceIds: value.snapshotBalances.map((balance) => balance.id),
    });
  }

  delete(id: number | string) {
    const snapshots = localStorageService.getObject('snapshots');
    if (snapshots[id]) {
      delete snapshots[id];
      return of(true);
    }
    return of(false);
  }
}
