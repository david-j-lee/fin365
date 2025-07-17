export type TabKey = 'summary' | 'calendar' | 'balance' | 'revenue' | 'expense'

export interface Tab {
  key: TabKey
  index: number
  label: string
}
