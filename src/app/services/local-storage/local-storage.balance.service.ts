import { Injectable } from '@angular/core'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { BalanceEdit } from '@interfaces/balances/balance-edit.interface'
import { Balance } from '@interfaces/balances/balance.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageBalanceService {
  getAll(budgetId: string): Observable<Balance[]> {
    const balances = localStorageService.getObject<Balance>('balances')
    return of(
      Object.values(balances).filter(
        (balance) => balance.budgetId === budgetId,
      ),
    )
  }

  add(value: BalanceAdd) {
    const balances = localStorageService.getObject<Balance>('balances')

    const id = getRansomStringFromObject(balances)
    balances[id] = { ...value, id }
    localStorageService.setObject('balances', balances)

    const response = id

    return of(response)
  }

  update(value: BalanceEdit) {
    const balances = localStorageService.getObject<Balance>('balances')
    const balance = balances[value.id]
    if (balance) {
      balance.description = value.description
      balance.amount = value.amount
      localStorageService.setObject('balances', balances)
      return of(true)
    }
    return of(false)
  }

  delete(id: string): Observable<boolean> {
    const balances = localStorageService.getObject<Balance>('balances')
    if (balances[id]) {
      delete balances[id]
      return of(true)
    }
    return of(false)
  }
}
