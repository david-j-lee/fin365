import { Injectable } from '@angular/core'
import { LocalStorageRuleService } from '@data/local-storage/local-storage.rule'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { RuleEdit as ruleEdit } from '@interfaces/rule-edit.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'

const SERVICE = 'localStorageRuleService'

@Injectable()
export class RuleAccess {
  private localStorageRuleService = LocalStorageRuleService

  async getAll(ruleType: RuleType, budgetId: string): Promise<Rule[]> {
    const data = await this[SERVICE].getAll(RulesMetadata[ruleType], budgetId)
    return data.map((item) => ({ ...item, type: ruleType }))
  }

  async add(ruleAdd: RuleAdd): Promise<Rule> {
    return await this[SERVICE].add(RulesMetadata[ruleAdd.type], ruleAdd)
  }

  async update(ruleOriginal: Rule, ruleEdit: ruleEdit): Promise<Rule | null> {
    ruleEdit.id = ruleOriginal.id
    const updatedRule = await this[SERVICE].update(
      RulesMetadata[ruleOriginal.type],
      ruleEdit,
    )
    if (!updatedRule) {
      return null
    }
    return {
      ...ruleOriginal,
      ...updatedRule,
    }
  }

  async delete(rule: Rule): Promise<boolean> {
    return await this[SERVICE].delete(RulesMetadata[rule.type], rule.id)
  }
}
