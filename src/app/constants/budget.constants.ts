import { Tab } from '@interfaces/tab.interface'

export const numberOfDays = 365

export const frequencies = [
  'Once',
  'Daily',
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Yearly',
]

export const tabs: Tab[] = [
  { key: 'summary', index: 0, label: 'Summary' },
  { key: 'balance', index: 1, label: 'Balances' },
  { key: 'revenue', index: 2, label: 'Revenues' },
  { key: 'expense', index: 3, label: 'Expenses' },
  { key: 'calendar', index: 4, label: 'Calendar' },
]
