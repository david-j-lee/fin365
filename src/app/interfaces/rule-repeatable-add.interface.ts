import { RuleAdd } from './rule-add.interface'

export interface RuleRepeatableAdd extends RuleAdd {
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
