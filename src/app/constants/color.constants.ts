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
