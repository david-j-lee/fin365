import { RuleEdit } from './rule-edit.interface'
import { Moment } from 'moment'

export interface RepeatableRuleEdit extends RuleEdit {
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
