import { Component, Input, OnInit, inject } from '@angular/core'
import { numberOfDays } from '@constants/budget.constants'
import { barOptions } from '@constants/chart.constants'
import { colorPalettes } from '@constants/color.constants'
import { ChartBalance } from '@interfaces/chart-balance.interface'
import { RuleType } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { ChartDataset } from 'chart.js'
import {
  addDays,
  addMonths,
  differenceInCalendarMonths,
  format,
} from 'date-fns'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-monthly-chart',
  templateUrl: 'monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.scss'],
  imports: [BaseChartDirective],
})
export class MonthlyChartComponent implements OnInit {
  private financeService = inject(FinanceService)

  @Input() ruleType: RuleType | null = null

  chartBalance: ChartBalance = {
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

    // rule id is the key, amounts indexed by month
    const data: Record<string, number[] | number[][]> = {}
    const ruleDescriptionsById: Record<string, string> = {}

    for (const day of this.financeService.budget.days()) {
      const monthIndex = differenceInCalendarMonths(
        day.date,
        this.financeService.budget.startDate,
      )

      if (this.ruleType === 'balance') {
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
      } else {
        for (const dailyItem of day.daily[this.ruleType]) {
          if (!data[dailyItem.rule.id]) {
            data[dailyItem.rule.id] = Array(numberOfMonths).fill(0)
            ruleDescriptionsById[dailyItem.rule.id] = dailyItem.rule.description
          }

          data[dailyItem.rule.id][monthIndex] =
            ((data[dailyItem.rule.id][monthIndex] as number) ?? 0) +
            dailyItem.amount
        }
      }
    }

    const datasets: ChartDataset[] = Object.entries(data).map(
      ([key, value]) => {
        return {
          // TODO: Use color palette based on total % of $s for each series.
          //       Bright is for higher yearly amount and darker would be for
          //       lower yearly amounts.
          ...colorPalettes[this.ruleType as keyof typeof colorPalettes],
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
}
