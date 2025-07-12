import { Injectable } from '@angular/core'
import { LocalStorageRuleRepeatableService } from '@data/local-storage/local-storage.rule-repeatable'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatableEdit } from '@interfaces/rule-repeatable-edit.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import moment from 'moment'

const SERVICE = 'localStorageRuleRepeatableService'

@Injectable()
export class DalRuleRepeatableService {
  private localStorageRuleRepeatableService = LocalStorageRuleRepeatableService

  async getAll(
    ruleType: RuleType,
    budgetId: string,
  ): Promise<RuleRepeatable[]> {
    const rules = await this[SERVICE].getAll(RulesMetadata[ruleType], budgetId)
    return rules.map((rule) => ({
      ...rule,
      startDate: rule.startDate ? moment(rule.startDate) : null,
      endDate: rule.endDate ? moment(rule.endDate) : null,
    }))
  }

  async add(ruleAdd: RuleRepeatableAdd): Promise<RuleRepeatable> {
    const addResult = await this[SERVICE].add(
      RulesMetadata[ruleAdd.type],
      ruleAdd,
    )
    return {
      ...addResult,
      startDate: addResult.startDate ? moment(addResult.startDate) : null,
      endDate: addResult.endDate ? moment(addResult.endDate) : null,
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
      startDate: updateResult.startDate ? moment(updateResult.startDate) : null,
      endDate: updateResult.endDate ? moment(updateResult.endDate) : null,
    }
  }

  async delete(rule: Rule): Promise<boolean> {
    return await this[SERVICE].delete(RulesMetadata[rule.type], rule.id)
  }
}
