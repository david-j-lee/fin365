import { RuleEdit } from './rule-edit.interface'

export interface RuleRepeatableEdit extends RuleEdit {
  isForever: boolean
  frequency: string

  startDate?: Date | null
  endDate?: Date | null

  repeatMon: boolean
  repeatTue: boolean
  repeatWed: boolean
  repeatThu: boolean
  repeatFri: boolean
  repeatSat: boolean
  repeatSun: boolean
}
