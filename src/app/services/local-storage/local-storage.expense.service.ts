import { Injectable } from '@angular/core'
import { ExpenseAdd } from '@interfaces/expenses/expense-add.interface'
import { ExpenseEdit } from '@interfaces/expenses/expense-edit.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { localStorageService } from '@utilities/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

@Injectable()
export class LocalStorageExpenseService {
  getAll(budgetId: string): Observable<Expense[]> {
    const expenses = localStorageService.getObject<Expense>('expenses')
    return of(
      Object.values(expenses).filter(
        (expense) => expense.budgetId === budgetId,
      ),
    )
  }

  add(value: ExpenseAdd) {
    const expenses = localStorageService.getObject<Expense>('expenses')

    const id = getRansomStringFromObject(expenses)
    expenses[id] = { ...value, id }
    localStorageService.setObject('expenses', expenses)

    const response = id

    return of(response)
  }

  update(value: ExpenseEdit) {
    const expenses = localStorageService.getObject<Expense>('expenses')
    const expense = expenses[value.id]
    if (expense) {
      expense.description = value.description
      expense.amount = value.amount
      expense.isForever = value.isForever
      expense.frequency = value.frequency
      expense.startDate = value.startDate
      expense.endDate = value.endDate
      expense.repeatMon = value.repeatMon
      expense.repeatTue = value.repeatTue
      expense.repeatWed = value.repeatWed
      expense.repeatThu = value.repeatThu
      expense.repeatFri = value.repeatFri
      expense.repeatSat = value.repeatSat
      expense.repeatSun = value.repeatSun
      localStorageService.setObject('expenses', expenses)
      return of(true)
    }
    return of(false)
  }

  delete(id: string) {
    const expenses = localStorageService.getObject<Expense>('expenses')
    if (expenses[id]) {
      delete expenses[id]
      return of(true)
    }
    return of(false)
  }
}
