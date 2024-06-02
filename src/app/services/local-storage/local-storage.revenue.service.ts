import { Injectable } from '@angular/core'
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { RevenueEdit } from '@interfaces/revenues/revenue-edit.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageRevenueService {
  getAll(budgetId: string): Observable<Revenue[]> {
    const revenues = localStorageService.getObject<Revenue>('revenues')
    return of(
      Object.values(revenues).filter(
        (revenue) => revenue.budgetId === budgetId,
      ),
    )
  }

  add(value: RevenueAdd) {
    const revenues = localStorageService.getObject<Revenue>('revenues')

    const id = getRansomStringFromObject(revenues)
    revenues[id] = { ...value, id }
    localStorageService.setObject('revenues', revenues)

    return of(id)
  }

  update(value: RevenueEdit) {
    const revenues = localStorageService.getObject<Revenue>('revenues')
    const revenue = revenues[value.id]
    if (revenue) {
      revenue.description = value.description
      revenue.amount = value.amount
      revenue.isForever = value.isForever
      revenue.frequency = value.frequency
      revenue.startDate = value.startDate
      revenue.endDate = value.endDate
      revenue.repeatMon = value.repeatMon
      revenue.repeatTue = value.repeatTue
      revenue.repeatWed = value.repeatWed
      revenue.repeatThu = value.repeatThu
      revenue.repeatFri = value.repeatFri
      revenue.repeatSat = value.repeatSat
      revenue.repeatSun = value.repeatSun
      localStorageService.setObject('revenues', revenues)
      return of(true)
    }
    return of(false)
  }

  delete(id: string) {
    const revenues = localStorageService.getObject<Revenue>('revenues')
    if (revenues[id]) {
      delete revenues[id]
      return of(true)
    }
    return of(false)
  }
}
