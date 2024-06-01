import { Injectable } from '@angular/core'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { BalanceEdit } from '@interfaces/balances/balance-edit.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageBalanceService {
  getAll(budgetId: number | string): Observable<object> {
    const balances = localStorageService.getObject('balances')
    return of(
      Object.values(balances).filter(
        // TODO:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (balance: any) => balance.budgetId === budgetId,
      ),
    )
  }

  add(value: BalanceAdd) {
    const balances = localStorageService.getObject('balances')

    const id = getRansomStringFromObject(balances)
    balances[id] = { ...value, id }
    localStorageService.setObject('balances', balances)

    const response = id

    return of(response)
  }

  update(value: BalanceEdit) {
    const balances = localStorageService.getObject('balances')
    const balance = balances[value.id]
    if (balance) {
      balance.description = value.description
      balance.amount = value.amount
      localStorageService.setObject('balances', balances)
      return of(true)
    }
    return of(false)
  }

  delete(id: number | string) {
    const balances = localStorageService.getObject('balances')
    if (balances[id]) {
      delete balances[id]
      return of(true)
    }
    return of(false)
  }
}
