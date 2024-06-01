import { Injectable } from '@angular/core'
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { RevenueEdit } from '@interfaces/revenues/revenue-edit.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageRevenueService {
  getAll(budgetId: number | string): Observable<object> {
    const revenues = localStorageService.getObject('revenues')
    return of(
      Object.values(revenues).filter(
        // TODO
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (revenue: any) => revenue.budgetId === budgetId,
      ),
    )
  }

  add(value: RevenueAdd) {
    const revenues = localStorageService.getObject('revenues')

    const id = getRansomStringFromObject(revenues)
    revenues[id] = { ...value, id }
    localStorageService.setObject('revenues', revenues)

    const response = id

    return of(response)
  }

  update(value: RevenueEdit) {
    const revenues = localStorageService.getObject('revenues')
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

  delete(id: number | string) {
    const revenues = localStorageService.getObject('revenues')
    if (revenues[id]) {
      delete revenues[id]
      return of(true)
    }
    return of(false)
  }
}
