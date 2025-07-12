import { Injectable, inject } from '@angular/core'
import { RepeatableRuleAdd } from '@interfaces/rules/repeatable-rule-add.interface'
import { RepeatableRuleEdit } from '@interfaces/rules/repeatable-rule-edit.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import { ChartService } from '@services/chart.service'
import { FinanceService } from '@services/finance.service'
import { Table } from '@storage/local-storage/local-storage-utilities'
import { LocalStorageRepeatableRuleService } from '@storage/local-storage/local-storage.repeatable-rule'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageRepeatableRuleService'

@Injectable()
export class DalRepeatableRuleService {
  private localStorageRepeatableRuleService = LocalStorageRepeatableRuleService

  private financeService = inject(FinanceService)
  private chartService = inject(ChartService)

  getAll(table: Table, budgetId: string): Observable<RepeatableRule[]> {
    return this[SERVICE].getAll(table, budgetId).pipe(
      map((result) =>
        result.map((item) => ({ ...item, type: 'revenue' }) as RepeatableRule),
      ),
    )
  }

  add(table: Table, value: RepeatableRuleAdd): Observable<RepeatableRule> {
    return this[SERVICE].add(table, value).pipe(
      map((result) => {
        const newRevenue: RepeatableRule = {
          type: 'revenue',
          id: result,
          budgetId: value.budgetId,
          description: value.description,
          amount: value.amount,
          isForever: value.isForever,
          frequency: value.frequency,
          startDate: value.startDate,
          endDate: value.endDate,
          repeatMon: value.repeatMon,
          repeatTue: value.repeatTue,
          repeatWed: value.repeatWed,
          repeatThu: value.repeatThu,
          repeatFri: value.repeatFri,
          repeatSat: value.repeatSat,
          repeatSun: value.repeatSun,
          yearlyAmount: 0,
          daily: [],
        }

        if (this.financeService.budget?.revenues) {
          this.financeService.budget.revenues.push(newRevenue)
        }

        // Update daily data and charts
        this.financeService.addRule(newRevenue)
        this.chartService.setChartRevenue()
        this.chartService.setChartBudget()

        return newRevenue
      }),
    )
  }

  update(
    table: Table,
    oldRevenue: RepeatableRule,
    newRevenue: RepeatableRuleEdit,
  ): Observable<RepeatableRule> {
    newRevenue.id = oldRevenue.id
    return this[SERVICE].update(table, newRevenue).pipe(
      map(() => {
        oldRevenue.description = newRevenue.description
        oldRevenue.amount = newRevenue.amount
        oldRevenue.isForever = newRevenue.isForever
        oldRevenue.frequency = newRevenue.frequency
        oldRevenue.startDate = newRevenue.startDate
        oldRevenue.endDate = newRevenue.endDate
        oldRevenue.repeatMon = newRevenue.repeatMon
        oldRevenue.repeatTue = newRevenue.repeatTue
        oldRevenue.repeatWed = newRevenue.repeatWed
        oldRevenue.repeatThu = newRevenue.repeatThu
        oldRevenue.repeatFri = newRevenue.repeatFri
        oldRevenue.repeatSat = newRevenue.repeatSat
        oldRevenue.repeatSun = newRevenue.repeatSun

        this.financeService.updateRule(oldRevenue)
        this.chartService.setChartRevenue()
        this.chartService.setChartBudget()

        return oldRevenue
      }),
    )
  }

  delete(table: Table, id: string): Observable<boolean> {
    return this[SERVICE].delete(table, id).pipe(
      map(() => {
        if (this.financeService.budget && this.financeService.budget.revenues) {
          const deletedRevenue = this.financeService.budget.revenues.find(
            (data) => data.id === id,
          )
          if (deletedRevenue) {
            this.financeService.budget.revenues.splice(
              this.financeService.budget.revenues.indexOf(deletedRevenue),
              1,
            )

            this.financeService.deleteRule(deletedRevenue)
            this.chartService.setChartRevenue()
            this.chartService.setChartBudget()

            return true
          }
        }
        return false
      }),
    )
  }
}
