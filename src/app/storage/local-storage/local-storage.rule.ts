import { RuleAdd } from '@interfaces/rules/rule-add.interface'
import { RuleEdit } from '@interfaces/rules/rule-edit.interface'
import { Rule } from '@interfaces/rules/rule.interface'
import {
  Table,
  localStorageService,
} from '@storage/local-storage/local-storage-utilities'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import { Observable, of } from 'rxjs'

export const LocalStorageRuleService = {
  getAll(table: Table, budgetId: string): Observable<Rule[]> {
    const rules = localStorageService.getObject<Rule>(table)
    return of(
      Object.values(rules).filter((balance) => balance.budgetId === budgetId),
    )
  },
  add(table: Table, value: RuleAdd) {
    const rules = localStorageService.getObject<Rule>(table)

    const id = getRansomStringFromObject(rules)
    rules[id] = { ...value, id }
    localStorageService.setObject(table, rules)

    const response = id

    return of(response)
  },
  update(table: Table, value: RuleEdit) {
    const rules = localStorageService.getObject<Rule>(table)
    const rule = rules[value.id]
    if (rule) {
      rule.description = value.description
      rule.amount = value.amount
      localStorageService.setObject(table, rules)
      return of(true)
    }
    return of(false)
  },
  delete(table: Table, id: string): Observable<boolean> {
    const rules = localStorageService.getObject<Rule>(table)
    if (rules[id]) {
      delete rules[id]
      return of(true)
    }
    return of(false)
  },
}
