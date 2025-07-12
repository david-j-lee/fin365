import { RuleEntity } from './rule.entity'

export interface RuleRepeatableEntity extends RuleEntity {
  isForever: boolean
  frequency: string

  startDate?: string | null
  endDate?: string | null

  repeatMon: boolean
  repeatTue: boolean
  repeatWed: boolean
  repeatThu: boolean
  repeatFri: boolean
  repeatSat: boolean
  repeatSun: boolean
}
