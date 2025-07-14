import { LocalStorageRuleRepeatableService } from '@data/local-storage/local-storage.rule-repeatable'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import { parseISO } from 'date-fns'

const SERVICE = 'localStorageRuleRepeatableService'

export class RuleRepeatableAccess {
  private localStorageRuleRepeatableService = LocalStorageRuleRepeatableService

  async getAll(
    ruleType: RuleType,
    budgetId: string,
  ): Promise<RuleRepeatable[]> {
    const rules = await this[SERVICE].getAll(RulesMetadata[ruleType], budgetId)
    return rules.map((rule) => ({
      ...rule,
      startDate: rule.startDate ? parseISO(rule.startDate) : null,
      endDate: rule.endDate ? parseISO(rule.endDate) : null,
    }))
  }

  async add(ruleAdd: RuleRepeatableAdd): Promise<RuleRepeatable> {
    const addResult = await this[SERVICE].add(
      RulesMetadata[ruleAdd.type],
      ruleAdd,
    )
    return {
      ...addResult,
      startDate: addResult.startDate ? parseISO(addResult.startDate) : null,
      endDate: addResult.endDate ? parseISO(addResult.endDate) : null,
      yearlyAmount: 0,
      daily: [],
    }
  }

  async update(
    ruleOriginal: RuleRepeatable,
    ruleEdit: RuleRepeatableEdit,
  ): Promise<RuleRepeatable | null> {
    ruleEdit.id = ruleOriginal.id
    const updateResult = await this[SERVICE].update(
      RulesMetadata[ruleOriginal.type],
      ruleEdit,
    )
    if (!updateResult) {
      return null
    }
    return {
      ...ruleOriginal,
      ...updateResult,
      startDate: updateResult.startDate
        ? parseISO(updateResult.startDate)
        : null,
      endDate: updateResult.endDate ? parseISO(updateResult.endDate) : null,
    }
  }

  async delete(rule: Rule): Promise<boolean> {
    return await this[SERVICE].delete(RulesMetadata[rule.type], rule.id)
  }
}
