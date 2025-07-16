import { DatePipe, DecimalPipe, NgClass } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { Day } from '@interfaces/day.interface'
import { FinanceService } from '@services/finance.service'
import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isFirstDayOfMonth,
  isSameDay,
  setMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  imports: [DatePipe, DecimalPipe, MatIcon, MatIconButton, MatTooltip, NgClass],
})
export class CalendarComponent {
  private financeService = inject(FinanceService)

  today: Date = new Date()
  days: Day[] = []
  currentMonthText = ''
  currentMonth = 0
  currentYear = 0

  private hasPrev = false
  private hasNext = true

  private minMonth = 0
  private maxMonth = 0

  private minYear = 0
  private maxYear = 0

  getMonth = getMonth
  isFirstDayOfMonth = isFirstDayOfMonth
  isSameDay = isSameDay

  constructor() {
    this.financeService.events.subscribe((event) => {
      if (event.resource !== 'budget') {
        return
      }
      this.setFirstMonth()
    })
  }

  setFirstMonth() {
    if (
      !this.financeService.budget?.days() ||
      this.financeService.budget.days().length == 0
    ) {
      return
    }

    const [firstDay] = this.financeService.budget.days()
    const lastDay =
      this.financeService.budget.days()[
        this.financeService.budget.days().length - 1
      ]

    this.minMonth = getMonth(firstDay.date) + 1
    this.maxMonth = getMonth(lastDay.date) + 1
    this.currentMonth = this.minMonth

    this.minYear = getYear(firstDay.date)
    this.maxYear = getYear(lastDay.date)
    this.currentYear = this.minYear

    this.setCurrentMonth(this.minYear, this.minMonth)
  }

  next() {
    if (!this.hasNext) {
      return
    }
    const newPeriod = this.addMonth(this.currentMonth, this.currentYear)
    this.currentMonth = newPeriod.month
    this.currentYear = newPeriod.year
    this.checkNext()
    this.checkPrev()
    this.setCurrentMonth(this.currentYear, this.currentMonth)
  }

  prev() {
    if (!this.hasPrev) {
      return
    }
    const newPeriod = this.removeMonth(this.currentMonth, this.currentYear)
    this.currentMonth = newPeriod.month
    this.currentYear = newPeriod.year
    this.checkNext()
    this.checkPrev()
    this.setCurrentMonth(this.currentYear, this.currentMonth)
  }

  private setCurrentMonth(year: number, month: number) {
    if (!this.financeService.budget?.days) {
      return
    }

    this.currentMonthText = format(
      setMonth(new Date(), this.currentMonth),
      'MMMM',
    )
    this.days = []

    const days = this.financeService.budget
      .days()
      .filter((day) => day.year === year && day.month + 1 === month)

    if (!days) {
      return
    }

    const firstDate = startOfWeek(startOfMonth(days[0].date))
    const lastDate = endOfWeek(endOfMonth(days[days.length - 1].date))
    const numLoops = differenceInDays(lastDate, firstDate)
    let lastBalance = 0

    for (let i = 0; i <= numLoops; i++) {
      const day = this.financeService.budget
        .days()
        .find((budgetDay) => isSameDay(budgetDay.date, addDays(firstDate, i)))

      if (day) {
        this.days.push(day)
        lastBalance = day.balance
      } else {
        const date = addDays(firstDate, i)
        const emptyDate: Day = {
          date,
          month: getMonth(firstDate),
          year: getYear(firstDate),
          balance: lastBalance,
          daily: {
            balance: [],
            revenue: [],
            expense: [],
            savings: [],
          },
          total: {
            balance: 0,
            revenue: 0,
            expense: 0,
            savings: 0,
          },
        }
        this.days.push(emptyDate)
      }
    }
  }

  private addMonth(
    month: number,
    year: number,
  ): { month: number; year: number } {
    let newMonth = month
    let newYear = year
    if (month === 12) {
      newMonth = 1
      newYear += 1
    } else {
      newMonth += 1
    }
    return { month: newMonth, year: newYear }
  }

  private removeMonth(
    month: number,
    year: number,
  ): { month: number; year: number } {
    let newMonth = month
    let newYear = year
    if (month === 1) {
      newMonth = 12
      newYear -= 1
    } else {
      newMonth -= 1
    }
    return { month: newMonth, year: newYear }
  }

  private checkNext() {
    const nextPeriod = this.addMonth(this.currentMonth, this.currentYear)
    if (nextPeriod.month > this.maxMonth && nextPeriod.year >= this.maxYear) {
      this.hasNext = false
    } else {
      this.hasNext = true
    }
  }

  private checkPrev() {
    const prevPeriod = this.removeMonth(this.currentMonth, this.currentYear)
    if (
      prevPeriod.year < this.minYear ||
      (prevPeriod.month < this.minMonth && prevPeriod.year === this.minYear)
    ) {
      this.hasPrev = false
    } else {
      this.hasPrev = true
    }
  }
}
