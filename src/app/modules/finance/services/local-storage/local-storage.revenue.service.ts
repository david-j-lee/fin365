import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { RevenueAdd } from '../../interfaces/revenues/revenue-add.interface';
import { RevenueEdit } from '../../interfaces/revenues/revenue-edit.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { sessionStorageService } from 'src/app/core/utilities/local-storage-utilities';

@Injectable()
export class LocalStorageRevenueService {
  getAll(budgetId: number | string): Observable<Object> {
    const revenues = sessionStorageService.getObject('revenues');
    return of(
      Object.values(revenues).filter(
        (revenue: any) => revenue.budgetId === budgetId
      )
    );
  }

  add(value: RevenueAdd) {
    const revenues = sessionStorageService.getObject('revenues');

    const id = getRansomStringFromObject(revenues);
    revenues[id] = { ...value, id };
    sessionStorageService.setObject('revenues', revenues);

    const response = id;

    return of(response);
  }

  update(value: RevenueEdit) {
    const revenues = sessionStorageService.getObject('revenues');
    const revenue = revenues[value.id];
    if (revenue) {
      revenue.description = value.description;
      revenue.amount = value.amount;
      revenue.isForever = value.isForever;
      revenue.frequency = value.frequency;
      revenue.startDate = value.startDate;
      revenue.endDate = value.endDate;
      revenue.repeatMon = value.repeatMon;
      revenue.repeatTue = value.repeatTue;
      revenue.repeatWed = value.repeatWed;
      revenue.repeatThu = value.repeatThu;
      revenue.repeatFri = value.repeatFri;
      revenue.repeatSat = value.repeatSat;
      revenue.repeatSun = value.repeatSun;
      sessionStorageService.setObject('revenues', revenues);
      return of(true);
    }
    return of(false);
  }

  delete(id: number | string) {
    const revenues = sessionStorageService.getObject('revenues');
    if (revenues[id]) {
      delete revenues[id];
      return of(true);
    }
    return of(false);
  }
}
