import { RuleAdd } from './rule-add.interface'
import { Moment } from 'moment'

export interface RuleRepeatableAdd extends RuleAdd {
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
