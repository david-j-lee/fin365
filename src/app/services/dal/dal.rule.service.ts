import { Injectable, inject } from '@angular/core'
import { RuleAdd } from '@interfaces/rules/rule-add.interface'
import { RuleEdit } from '@interfaces/rules/rule-edit.interface'
import { Rule } from '@interfaces/rules/rule.interface'
import { ChartService } from '@services/chart.service'
import { FinanceService } from '@services/finance.service'
import { Table } from '@storage/local-storage/local-storage-utilities'
import { LocalStorageRuleService } from '@storage/local-storage/local-storage.rule'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageRuleService'

@Injectable()
export class DalRuleService {
  private localStorageRuleService = LocalStorageRuleService

  private financeService = inject(FinanceService)
  private chartService = inject(ChartService)

  getAll(table: Table, budgetId: string): Observable<Rule[]> {
    return this[SERVICE].getAll(table, budgetId).pipe(
      map((result) => result.map((item) => ({ ...item, type: 'balance' }))),
    )
  }

  add(table: Table, value: RuleAdd): Observable<Rule> {
    return this[SERVICE].add(table, value).pipe(
      map((result) => {
        const newBalance: Rule = {
          type: 'balance',
          id: result,
          description: value.description,
          amount: value.amount,
          budgetId: value.budgetId,
        }

        if (this.financeService.budget?.balances) {
          this.financeService.budget.balances.push(newBalance)
        }

        this.financeService.addRule(newBalance)
        this.chartService.setChartBalance()
        this.chartService.setChartBudget()

        return newBalance
      }),
    )
  }

  update(
    table: Table,
    oldBalance: Rule,
    newBalance: RuleEdit,
  ): Observable<Rule> {
    newBalance.id = oldBalance.id
    return this[SERVICE].update(table, newBalance).pipe(
      map(() => {
        oldBalance.description = newBalance.description
        oldBalance.amount = newBalance.amount

        this.financeService.updateRule(oldBalance)
        this.chartService.setChartBalance()
        this.chartService.setChartBudget()

        return oldBalance
      }),
    )
  }

  delete(table: Table, id: string): Observable<boolean> {
    return this[SERVICE].delete(table, id).pipe(
      map(() => {
        if (this.financeService.budget && this.financeService.budget.balances) {
          const deletedBalance = this.financeService.budget.balances.find(
            (data) => data.id === id,
          )
          if (deletedBalance) {
            this.financeService.budget.balances.splice(
              this.financeService.budget.balances.indexOf(deletedBalance),
              1,
            )

            this.financeService.deleteRule(deletedBalance)
            this.chartService.setChartBalance()
            this.chartService.setChartBudget()

            return true
          }
        }
        return false
      }),
    )
  }
}
