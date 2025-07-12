import { RuleRepeatableEntity } from '@data/entities/rule-repeatable.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleMetadata } from '@interfaces/rule.interface'
import { getRansomStringFromObject } from '@utilities/string-utilities'

export const LocalStorageRuleRepeatableService = {
  async getAll(
    ruleMetadata: RuleMetadata,
    budgetId: string,
  ): Promise<RuleRepeatableEntity[]> {
    return Promise.resolve(
      Object.values(
        localStorageService.getObject<RuleRepeatableEntity>(
          ruleMetadata.tableName,
        ),
      )
        .filter((rule) => rule.budgetId === budgetId)
        .map((rule) => ({ ...rule, type: ruleMetadata.type })),
    )
  },
  async add(
    ruleMetadata: RuleMetadata,
    value: RuleRepeatableAdd,
  ): Promise<RuleRepeatableEntity> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleMetadata.tableName,
    )
    const rule = {
      ...value,
      id: getRansomStringFromObject(rules),
      startDate: value.startDate?.toString(),
      endDate: value.endDate?.toString(),
    }
    rules[rule.id] = rule
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(rule)
  },
  async update(
    ruleInfo: RuleMetadata,
    value: RuleRepeatableEdit,
  ): Promise<RuleRepeatableEntity | null> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleInfo.tableName,
    )
    const rule = rules[value.id]
    if (!rule) {
      return Promise.resolve(null)
    }
    rule.description = value.description
    rule.amount = value.amount
    rule.isForever = value.isForever
    rule.frequency = value.frequency
    rule.startDate = value.startDate?.toString()
    rule.endDate = value.endDate?.toString()
    rule.repeatMon = value.repeatMon
    rule.repeatTue = value.repeatTue
    rule.repeatWed = value.repeatWed
    rule.repeatThu = value.repeatThu
    rule.repeatFri = value.repeatFri
    rule.repeatSat = value.repeatSat
    rule.repeatSun = value.repeatSun
    localStorageService.setObject(ruleInfo.tableName, rules)
    return Promise.resolve(rule)
  },
  async delete(ruleMetadata: RuleMetadata, id: string): Promise<boolean> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleMetadata.tableName,
    )
    if (!rules[id]) {
      return Promise.resolve(false)
    }
    delete rules[id]
    return Promise.resolve(true)
  },
}
