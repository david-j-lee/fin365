// public virtual int Id { get; set; }

//         public virtual DateTime? Date { get; set; }
//         public virtual double EstimatedBalance { get; set; }
//         public virtual double ActualBalance { get; set; }

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SnapshotAddAll } from '../../interfaces/snapshots/snapshot-add-all.interface';
import { getRansomStringFromObject } from 'src/app/core/utilities/string-utilities';
import { sessionStorageService } from 'src/app/core/utilities/local-storage-utilities';

@Injectable()
export class LocalStorageSnapshotService {
  getAll(budgetId: number | string): Observable<Object> {
    const snapshots = sessionStorageService.getObject('snapshots');
    return of(
      Object.values(snapshots).filter(
        (snapshot: any) => snapshot.budgetId === budgetId
      )
    );
  }

  save(value: SnapshotAddAll) {
    console.log(value);
    const snapshots = sessionStorageService.getObject('snapshots');

    const id = getRansomStringFromObject(snapshots);
    snapshots[id] = { ...value, id };
    sessionStorageService.setObject('snapshots', snapshots);

    const response = id;

    return of(response);
  }

  delete(id: number | string) {
    const snapshots = sessionStorageService.getObject('snapshots');
    if (snapshots[id]) {
      delete snapshots[id];
      return of(true);
    }
    return of(false);
  }
}
