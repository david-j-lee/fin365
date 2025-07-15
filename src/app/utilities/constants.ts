import { Tab } from '@interfaces/tab.interface'

export const tabs: Tab[] = [
  { key: 'summary', index: 0, label: 'Summary' },
  { key: 'calendar', index: 1, label: 'Calendar' },
  { key: 'balance', index: 2, label: 'Balances' },
  { key: 'revenue', index: 3, label: 'Revenues' },
  { key: 'expense', index: 4, label: 'Expenses' },
]

export const numberOfDays = 365

export const frequencies = [
  'Once',
  'Daily',
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Yearly',
]

export const pieOptions = {
  animation: { duration: 0 },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
}

export const balanceColors = {
  Lightest: 'rgba(54, 162, 235, 0.2)',
  Light: 'rgba(54, 162, 235, 0.8)',
  Normal: 'rgba(54, 162, 235, 1)',
}

export const revenueColors = {
  Lightest: 'rgba(75, 192, 192, 0.2)',
  Light: 'rgba(75, 192, 192, 0.8)',
  Normal: 'rgba(75, 192, 192, 1)',
}

export const expenseColors = {
  Lightest: 'rgba(255, 99, 132, 0.2)',
  Light: 'rgba(255, 99, 132, 0.8)',
  Normal: 'rgba(255, 99, 132, 1)',
}

export const colorPalettes = {
  balances: {
    // Balances
    color: balanceColors.Normal,
    backgroundColor: balanceColors.Lightest,
    hoverBackgroundColor: balanceColors.Light,
    borderColor: balanceColors.Normal,
    hoverBorderColor: balanceColors.Normal,
    pointBackgroundColor: balanceColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: balanceColors.Light,
  },
  revenues: {
    // Revenues
    color: revenueColors.Normal,
    backgroundColor: revenueColors.Lightest,
    hoverBackgroundColor: revenueColors.Light,
    borderColor: revenueColors.Normal,
    hoverBorderColor: revenueColors.Normal,
    pointBackgroundColor: revenueColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: revenueColors.Light,
  },
  expenses: {
    // Expenses
    color: expenseColors.Normal,
    backgroundColor: expenseColors.Lightest,
    hoverBackgroundColor: expenseColors.Light,
    borderColor: expenseColors.Normal,
    hoverBorderColor: expenseColors.Normal,
    pointBackgroundColor: expenseColors.Normal,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: expenseColors.Light,
  },
}
