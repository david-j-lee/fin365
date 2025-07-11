import { Injectable, inject } from '@angular/core'
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { RevenueEdit } from '@interfaces/revenues/revenue-edit.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageRevenueService } from '@storage/local-storage/local-storage.revenue'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageRevenueService'

@Injectable()
export class DalRevenueService {
  private localStorageRevenueService = LocalStorageRevenueService

  private financeService = inject(FinanceService)
  private dailyService = inject(DailyService)
  private chartService = inject(ChartService)

  getAll(budgetId: string): Observable<Revenue[]> {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  add(value: RevenueAdd): Observable<Revenue> {
    return this[SERVICE].add(value).pipe(
      map((result) => {
        const newRevenue: Revenue = {
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
          dailyRevenues: [],
        }

        if (this.financeService.budget?.revenues) {
          this.financeService.budget.revenues.push(newRevenue)
        }

        // Update daily data and charts
        this.dailyService.generateRevenue(newRevenue)
        newRevenue.yearlyAmount = this.dailyService.getTotalRevenue(newRevenue)
        this.dailyService.setRunningTotals()
        this.chartService.setChartRevenue()
        this.chartService.setChartBudget()

        return newRevenue
      }),
    )
  }

  update(oldRevenue: Revenue, newRevenue: RevenueEdit): Observable<Revenue> {
    newRevenue.id = oldRevenue.id
    return this[SERVICE].update(newRevenue).pipe(
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

        this.dailyService.deleteRevenue(oldRevenue)
        this.dailyService.generateRevenue(oldRevenue)
        oldRevenue.yearlyAmount = this.dailyService.getTotalRevenue(oldRevenue)
        this.dailyService.setRunningTotals()
        this.chartService.setChartRevenue()
        this.chartService.setChartBudget()

        return oldRevenue
      }),
    )
  }

  delete(id: string): Observable<boolean> {
    return this[SERVICE].delete(id).pipe(
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

            this.dailyService.deleteRevenue(deletedRevenue)
            this.dailyService.setRunningTotals()
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
