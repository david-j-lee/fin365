import { getRgba } from '@utilities/color.utilities'

export const colorsRgb = {
  balance: '54, 162, 235',
  revenue: '75, 192, 192',
  expense: '255, 99, 132',
}

const balanceColors = {
  Lightest: getRgba(colorsRgb.balance, 0.4),
  Light: getRgba(colorsRgb.balance, 0.8),
  Normal: getRgba(colorsRgb.balance, 1),
}

const revenueColors = {
  Lightest: getRgba(colorsRgb.revenue, 0.4),
  Light: getRgba(colorsRgb.revenue, 0.8),
  Normal: getRgba(colorsRgb.revenue, 1),
}

const expenseColors = {
  Lightest: getRgba(colorsRgb.expense, 0.4),
  Light: getRgba(colorsRgb.expense, 0.8),
  Normal: getRgba(colorsRgb.expense, 1),
}

export const colorPalettes = {
  balance: {
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
  revenue: {
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
  expense: {
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
