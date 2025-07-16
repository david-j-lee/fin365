import { Component, Input, OnInit, computed, inject } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { colorPalettes } from '@constants/color.constants'
import { Day } from '@interfaces/day.interface'
import { RuleType } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import {
  differenceInDays,
  format,
  getDay,
  setDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

interface HeatMapRow {
  label: string
  items: HeatMapItem[]
}

interface HeatMapItem {
  day?: Day
  tooltip?: string
  intensity: number
}

const baselineOpacity = 0.3

@Component({
  selector: 'app-yearly-heat-map',
  templateUrl: 'yearly-heat-map.component.html',
  styleUrls: ['yearly-heat-map.component.scss'],
  imports: [MatTooltip],
})
export class YearlyHeatMapComponent implements OnInit {
  private financeService = inject(FinanceService)

  @Input() ruleType: RuleType | null = null
  color: string | null = null

  weekdayLabels = [
    null,
    format(setDay(new Date(), 1), 'E'),
    null,
    format(setDay(new Date(), 3), 'E'),
    null,
    format(setDay(new Date(), 5), 'E'),
    null,
  ]

  data = computed(() => {
    if (
      !this.financeService.budget ||
      this.financeService.budget.days().length === 0 ||
      !this.ruleType
    ) {
      return null
    }

    const isBalance = this.ruleType === 'balance'
    const data: HeatMapRow[] = []
    const weekdayOfStart = getDay(this.financeService.budget.days()[0].date)
    let dayCounter = 0
    let weekCounter = 0

    // add initial week days not part of budget
    if (weekdayOfStart !== 0) {
      data[weekCounter] = { label: '', items: [] }

      for (let i = 0; i < weekdayOfStart; i++) {
        data[weekCounter].items.push({ intensity: 0 })
        dayCounter++
      }
    }

    const maxValue = this.financeService.budget
      .days()
      .reduce(
        (accumulator, day) =>
          Math.max(
            accumulator,
            isBalance ? day.balance : day.total[this.ruleType as RuleType],
          ),
        0,
      )

    for (const day of this.financeService.budget.days()) {
      if (dayCounter % 7 === 0) {
        weekCounter++
      }

      if (!data[weekCounter]) {
        const label =
          differenceInDays(startOfWeek(day.date), startOfMonth(day.date)) < 7
            ? format(day.date, 'MMM')
            : ''
        data[weekCounter] = { label, items: [] }
      }

      const amount = isBalance ? day.balance : day.total[this.ruleType]
      const intensity = amount / maxValue

      data[weekCounter].items.push({
        day,
        intensity:
          intensity === 0
            ? 0
            : baselineOpacity + (1 - baselineOpacity) * intensity,
        tooltip: `$${amount} on ${format(day.date, 'PP')}`,
      })
      dayCounter++
    }

    return data
  })

  ngOnInit() {
    this.color = this.ruleType
      ? colorPalettes[this.ruleType as keyof typeof colorPalettes].color
      : null
  }

  format = format
}
