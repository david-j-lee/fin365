import { RuleEntity } from '@data/entities/rule.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { RuleMetadata } from '@interfaces/rule.interface'
import { getRansomStringFromObject } from '@utilities/string.utilities'

export const LocalStorageRuleService = {
  async getAll(
    ruleMetadata: RuleMetadata,
    budgetId: string,
  ): Promise<RuleEntity[]> {
    return Promise.resolve(
      Object.values(
        localStorageService.getObject<RuleEntity>(ruleMetadata.tableName),
      )
        .filter((balance) => balance.budgetId === budgetId)
        .map((rule) => ({ ...rule, type: ruleMetadata.type })),
    )
  },
  async add(ruleMetadata: RuleMetadata, ruleAdd: RuleAdd): Promise<RuleEntity> {
    const rules = localStorageService.getObject<RuleEntity>(
      ruleMetadata.tableName,
    )
    const rule = { ...ruleAdd, id: getRansomStringFromObject(rules) }
    rules[rule.id] = rule
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(rule)
  },
  async update(
    ruleMetadata: RuleMetadata,
    ruleEdit: RuleEdit,
  ): Promise<RuleEntity | null> {
    const rules = localStorageService.getObject<RuleEntity>(
      ruleMetadata.tableName,
    )
    const rule = rules[ruleEdit.id]
    if (!rule) {
      return Promise.resolve(null)
    }
    const updatedRule = {
      ...rule,
      ...ruleEdit,
    }
    rules[ruleEdit.id] = updatedRule
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(updatedRule)
  },
  async delete(ruleMetadata: RuleMetadata, id: string): Promise<boolean> {
    const rules = localStorageService.getObject<RuleEntity>(
      ruleMetadata.tableName,
    )
    if (!rules[id]) {
      return Promise.resolve(false)
    }
    delete rules[id]
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(true)
  },
}
