import { RuleEntity } from '@data/entities/rule.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleMetadata } from '@interfaces/rule.interface'
import { getRansomStringFromObject } from '@utilities/string-utilities'

export const LocalStorageRuleService = {
  async getAll(
    ruleInfo: RuleMetadata,
    budgetId: string,
  ): Promise<RuleEntity[]> {
    return Promise.resolve(
      Object.values(
        localStorageService.getObject<RuleEntity>(ruleInfo.tableName),
      )
        .filter((balance) => balance.budgetId === budgetId)
        .map((rule) => ({ ...rule, type: ruleInfo.type })),
    )
  },
  async add(ruleInfo: RuleMetadata, value: RuleAdd): Promise<RuleEntity> {
    const rules = localStorageService.getObject<RuleEntity>(ruleInfo.tableName)
    const rule = { ...value, id: getRansomStringFromObject(rules) }
    rules[rule.id] = rule
    localStorageService.setObject(ruleInfo.tableName, rules)
    return Promise.resolve(rule)
  },
  async update(
    ruleInfo: RuleMetadata,
    value: RuleEdit,
  ): Promise<RuleEntity | null> {
    const rules = localStorageService.getObject<RuleEntity>(ruleInfo.tableName)
    const rule = rules[value.id]
    if (!rule) {
      return Promise.resolve(null)
    }
    rule.description = value.description
    rule.amount = value.amount
    localStorageService.setObject(ruleInfo.tableName, rules)
    return Promise.resolve(rule)
  },
  async delete(ruleInfo: RuleMetadata, id: string): Promise<boolean> {
    const rules = localStorageService.getObject<RuleEntity>(ruleInfo.tableName)
    if (!rules[id]) {
      return Promise.resolve(false)
    }
    delete rules[id]
    return Promise.resolve(true)
  },
}
