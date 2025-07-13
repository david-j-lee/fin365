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
    ruleAdd: RuleRepeatableAdd,
  ): Promise<RuleRepeatableEntity> {
    const rules = localStorageService.getObject<RuleRepeatableEntity>(
      ruleMetadata.tableName,
    )
    const rule = {
      ...ruleAdd,
      id: getRansomStringFromObject(rules),
      startDate: ruleAdd.startDate?.toString(),
      endDate: ruleAdd.endDate?.toString(),
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
    rules[ruleEdit.id] = {
      ...rule,
      ...ruleEdit,
      startDate: ruleEdit.startDate?.toString(),
      endDate: ruleEdit.endDate?.toString(),
    }
    localStorageService.setObject(ruleMetadata.tableName, rules)
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
    localStorageService.setObject(ruleMetadata.tableName, rules)
    return Promise.resolve(true)
  },
}
