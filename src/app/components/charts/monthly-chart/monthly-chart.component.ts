import { Component, Input, OnInit, inject } from '@angular/core'
import { numberOfDays } from '@constants/budget.constants'
import { barOptions } from '@constants/chart.constants'
import {
  colorPalettes,
  colorsRgb,
  getColorWithTransparency,
} from '@constants/color.constants'
import { Day } from '@interfaces/day.interface'
import { MonthlyChart } from '@interfaces/monthly-chart.interface'
import { RuleType } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { getAlpha } from '@utilities/rule.utilities'
import { ChartDataset } from 'chart.js'
import {
  addDays,
  addMonths,
  differenceInCalendarMonths,
  format,
} from 'date-fns'
import { BaseChartDirective } from 'ng2-charts'

const baseOpacity = 0.5

@Component({
  selector: 'app-monthly-chart',
  templateUrl: 'monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.scss'],
  imports: [BaseChartDirective],
})
export class MonthlyChartComponent implements OnInit {
  private financeService = inject(FinanceService)

  @Input() ruleType: RuleType | null = null

  chartBalance: MonthlyChart = {
    chartType: 'bar',
    options: {
      ...barOptions,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
    data: {
      labels: [],
      datasets: [],
    },
  }

  ngOnInit() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === this.ruleType) {
        this.setChartBalance()
      }
    })
  }

  private setChartBalance() {
    if (!this.financeService.budget || !this.ruleType) {
      return
    }

    const labels: string[] = []
    const endDate = addDays(this.financeService.budget.startDate, numberOfDays)
    const numberOfMonths = differenceInCalendarMonths(
      endDate,
      this.financeService.budget.startDate,
    )

    for (let i = 0; i < numberOfMonths; i++) {
      labels.push(
        format(addMonths(this.financeService.budget.startDate, i), 'MMM'),
      )
    }

    // rule id is the key with amounts as the value
    const data: Record<string, number[] | number[][]> = {}
    const ruleDescriptionsById: Record<string, string> = {}
    const ruleYearlyTotalsById: Record<string, number> = {}

    for (const day of this.financeService.budget.days()) {
      const monthIndex = differenceInCalendarMonths(
        day.date,
        this.financeService.budget.startDate,
      )

      switch (this.ruleType) {
        case 'balance':
          this.setForBalanceRuleType(
            data,
            ruleDescriptionsById,
            monthIndex,
            day,
          )
          break
        default:
          this.setForDefaultRuleType(
            data,
            ruleDescriptionsById,
            ruleYearlyTotalsById,
            numberOfMonths,
            monthIndex,
            day,
          )
          break
      }
    }

    const rankedRules =
      this.ruleType === 'balance'
        ? []
        : Object.keys(data)
            .map((ruleId) => ({
              id: ruleId,
              amount: ruleYearlyTotalsById[ruleId] ?? 0,
            }))
            .sort()
            .map((item, index) => ({
              ...item,
              rank: index + 1,
              alpha: getAlpha(
                baseOpacity,
                Object.keys(data).length < 1
                  ? 1
                  : 1 - index / (Object.keys(data).length - 1),
              ),
            }))

    const ruleRanksById = rankedRules.reduce(
      (accumulator, item) => {
        accumulator[item.id] = item
        return accumulator
      },
      {} as Record<string, (typeof rankedRules)[0]>,
    )

    const datasets: ChartDataset[] = Object.entries(data).map(
      ([key, value]) => {
        return {
          // TODO: Use color palette based on total % of $s for each series.
          //       Bright is for higher yearly amount and darker would be for
          //       lower yearly amounts.
          ...colorPalettes[this.ruleType as keyof typeof colorPalettes],
          backgroundColor: getColorWithTransparency(
            colorsRgb[this.ruleType as keyof typeof colorsRgb],
            ruleRanksById[key] ? ruleRanksById[key].alpha : 1,
          ),
          label: ruleDescriptionsById[key],
          data: Object.values(value),
        }
      },
    )

    this.chartBalance.data = {
      ...this.chartBalance.data,
      labels,
      datasets,
    }
  }

  private setForBalanceRuleType(
    data: Record<string, number[] | number[][]>,
    ruleDescriptionsById: Record<string, string>,
    monthIndex: number,
    day: Day,
  ) {
    if (!data['balance']) {
      data['balance'] = []
      ruleDescriptionsById['balance'] = 'Monthly Balance Range'
    }

    const hasMonthIndex = data['balance'][monthIndex]
    const lowEnd = hasMonthIndex
      ? (data['balance'][monthIndex] as number[])[0]
      : undefined
    const highEnd = hasMonthIndex
      ? (data['balance'][monthIndex] as number[])[1]
      : 0

    data['balance'][monthIndex] = [
      lowEnd === undefined ? day.balance : Math.min(lowEnd, day.balance),
      Math.max(highEnd ?? 0, day.balance),
    ]
  }

  private setForDefaultRuleType(
    data: Record<string, number[] | number[][]>,
    ruleDescriptionsById: Record<string, string>,
    ruleYearlyTotalsById: Record<string, number>,
    numberOfMonths: number,
    monthIndex: number,
    day: Day,
  ) {
    if (!this.ruleType) {
      return
    }

    for (const dailyItem of day.daily[this.ruleType]) {
      if (!data[dailyItem.rule.id]) {
        data[dailyItem.rule.id] = Array(numberOfMonths).fill(0)
        ruleDescriptionsById[dailyItem.rule.id] = dailyItem.rule.description
        ruleYearlyTotalsById[dailyItem.rule.id] = dailyItem.rule.yearlyAmount
      }

      data[dailyItem.rule.id][monthIndex] =
        ((data[dailyItem.rule.id][monthIndex] as number) ?? 0) +
        dailyItem.amount
    }
  }
}
