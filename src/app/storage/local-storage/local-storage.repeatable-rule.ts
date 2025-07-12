import { RepeatableRuleAdd } from '@interfaces/rules/repeatable-rule-add.interface'
import { RepeatableRuleEdit } from '@interfaces/rules/repeatable-rule-edit.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import {
  Table,
  localStorageService,
} from '@storage/local-storage/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

export const LocalStorageRepeatableRuleService = {
  getAll(table: Table, budgetId: string): Observable<RepeatableRule[]> {
    const rules = localStorageService.getObject<RepeatableRule>(table)
    return of(Object.values(rules).filter((rule) => rule.budgetId === budgetId))
  },
  add(table: Table, value: RepeatableRuleAdd) {
    const rules = localStorageService.getObject<RepeatableRule>(table)
    const id = getRansomStringFromObject(rules)

    rules[id] = { ...value, id }
    localStorageService.setObject(table, rules)

    const response = id

    return of(response)
  },
  update(table: Table, value: RepeatableRuleEdit) {
    const rules = localStorageService.getObject<RepeatableRule>(table)
    const rule = rules[value.id]
    if (rule) {
      rule.description = value.description
      rule.amount = value.amount
      rule.isForever = value.isForever
      rule.frequency = value.frequency
      rule.startDate = value.startDate
      rule.endDate = value.endDate
      rule.repeatMon = value.repeatMon
      rule.repeatTue = value.repeatTue
      rule.repeatWed = value.repeatWed
      rule.repeatThu = value.repeatThu
      rule.repeatFri = value.repeatFri
      rule.repeatSat = value.repeatSat
      rule.repeatSun = value.repeatSun
      localStorageService.setObject(table, rules)
      return of(true)
    }
    return of(false)
  },
  delete(table: Table, id: string) {
    const rules = localStorageService.getObject<RepeatableRule>(table)
    if (rules[id]) {
      delete rules[id]
      return of(true)
    }
    return of(false)
  },
}
