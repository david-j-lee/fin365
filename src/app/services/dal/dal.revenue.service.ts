/*
  This data access layer handles all the business logic after an webAPI call
*/
import { Injectable } from '@angular/core'
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { RevenueEdit } from '@interfaces/revenues/revenue-edit.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageRevenueService } from '@services/local-storage/local-storage.revenue.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const SERVICE = 'localStorageRevenueService'

@Injectable()
export class DalRevenueService {
  constructor(
    private localStorageRevenueService: LocalStorageRevenueService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
  ) {}

  getAll(budgetId: string): Observable<Revenue[]> {
    return this[SERVICE].getAll(budgetId).pipe(map((result) => result))
  }

  add(value: RevenueAdd): Observable<Revenue> {
    return this[SERVICE].add(value).pipe(
      map((result) => {
        // add new class locally
        const newRevenue: Revenue = {
          id: result,
          budgetId: value.budgetId,
          description: value.description,
          amount: value.amount as number,
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

        if (this.financeService.selectedBudget?.revenues) {
          this.financeService.selectedBudget.revenues.push(newRevenue)
        }

        // update daily data and charts
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

        // update daily data and charts
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
        if (
          this.financeService.selectedBudget &&
          this.financeService.selectedBudget.revenues
        ) {
          const deletedRevenue =
            this.financeService.selectedBudget.revenues.find(
              (data) => data.id === id,
            )
          if (deletedRevenue) {
            this.financeService.selectedBudget.revenues.splice(
              this.financeService.selectedBudget.revenues.indexOf(
                deletedRevenue,
              ),
              1,
            )

            // update daily data and chart
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
