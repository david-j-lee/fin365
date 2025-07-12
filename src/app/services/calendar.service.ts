import { FinanceService } from './finance.service'
import { Injectable, inject } from '@angular/core'
import { Day } from '@interfaces/daily/day.interface'
import moment from 'moment'

@Injectable()
export class CalendarService {
  private financeService = inject(FinanceService)

  days: Day[] = []

  hasPrev = false
  hasNext = true

  currentMonthText = ''
  currentMonth = 0
  minMonth = 0
  maxMonth = 0

  currentYear = 0
  minYear = 0
  maxYear = 0

  setFirstMonth() {
    if (
      this.financeService.budget?.days &&
      this.financeService.budget.days.length > 0
    ) {
      const [firstDay] = this.financeService.budget.days
      const lastDay =
        this.financeService.budget.days[
          this.financeService.budget.days.length - 1
        ]

      this.minMonth = firstDay.date.month() + 1
      this.maxMonth = lastDay.date.month() + 1
      this.currentMonth = this.minMonth

      this.minYear = firstDay.date.year()
      this.maxYear = lastDay.date.year()
      this.currentYear = this.minYear

      this.setMonth(this.minYear, this.minMonth)
    }
  }

  setMonth(year: number, month: number) {
    if (this.financeService.budget?.days) {
      this.currentMonthText = moment(this.currentMonth, 'M').format('MMMM')
      this.days = []
      const days = this.financeService.budget.days.filter(
        (day) => day.year === year && day.month + 1 === month,
      )

      if (days) {
        let firstDate = days[0].date.clone().startOf('month')
        if (!firstDate.weekday(0)) {
          firstDate = firstDate.add(-7, 'days').isoWeekday(7)
        }

        const lastDate = days[days.length - 1].date
          .clone()
          .endOf('month')
          .isoWeekday(6)
        const numLoops = lastDate.diff(firstDate, 'days')
        let lastBalance = 0

        for (let i = 0; i <= numLoops; i++) {
          const day = this.financeService.budget.days.find(
            (budgetDay) =>
              budgetDay.date.format('L') ===
              firstDate.clone().add(i, 'days').format('L'),
          )

          if (day) {
            this.days.push(day)
            lastBalance = day.balance
          } else {
            const emptyDate: Day = {
              date: firstDate.clone().add(i, 'days'),
              month: firstDate.clone().add(i, 'days').month(),
              year: firstDate.clone().add(i, 'days').year(),

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
    }
  }

  next() {
    if (this.hasNext) {
      const newPeriod = this.addMonth(this.currentMonth, this.currentYear)
      this.currentMonth = newPeriod.month
      this.currentYear = newPeriod.year

      this.checkNext()
      this.checkPrev()

      this.setMonth(this.currentYear, this.currentMonth)
    }
  }

  prev() {
    if (this.hasPrev) {
      const newPeriod = this.removeMonth(this.currentMonth, this.currentYear)
      this.currentMonth = newPeriod.month
      this.currentYear = newPeriod.year

      this.checkNext()
      this.checkPrev()

      this.setMonth(this.currentYear, this.currentMonth)
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
