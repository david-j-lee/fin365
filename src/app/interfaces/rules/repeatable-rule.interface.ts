import { Rule } from './rule.interface'
import { Moment } from 'moment'

export interface RepeatableRule extends Rule {
  isForever: boolean
  frequency: string

  startDate?: Moment | null
  endDate?: Moment | null

  repeatMon: boolean
  repeatTue: boolean
  repeatWed: boolean
  repeatThu: boolean
  repeatFri: boolean
  repeatSat: boolean
  repeatSun: boolean
}
