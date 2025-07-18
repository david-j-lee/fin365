import { RuleRepeatableEntity } from '@data/entities/rule-repeatable.entity'
import { localStorageService } from '@data/local-storage/local-storage-utilities'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleMetadata } from '@interfaces/rule.interface'
import { getRansomStringFromObject } from '@utilities/string.utilities'

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
    ruleAdd: RuleRepeatableAdd,
  ): Promise<RuleRepeatableEntity> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleMetadata.tableName,
    )
    const rule = {
      ...ruleAdd,
      id: getRansomStringFromObject(rules),
      startDate: ruleAdd.startDate?.toISOString(),
      endDate: ruleAdd.endDate?.toISOString(),
    }
    rules[rule.id] = rule
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(rule)
  },
  async update(
    ruleMetadata: RuleMetadata,
    ruleEdit: RuleRepeatableEdit,
  ): Promise<RuleRepeatableEntity | null> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleMetadata.tableName,
    )
    const rule = rules[ruleEdit.id]
    if (!rule) {
      return Promise.resolve(null)
    }
    const updatedRule = {
      ...rule,
      ...ruleEdit,
      startDate: ruleEdit.startDate?.toISOString(),
      endDate: ruleEdit.endDate?.toISOString(),
    }
    rules[ruleEdit.id] = updatedRule
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(updatedRule)
  },
  async delete(ruleMetadata: RuleMetadata, id: string): Promise<boolean> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
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
