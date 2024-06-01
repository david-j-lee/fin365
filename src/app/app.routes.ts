import { Routes } from '@angular/router'
import { BalanceAddComponent } from '@components/finance/balances/balance-add/balance-add.component'
import { BalanceDeleteComponent } from '@components/finance/balances/balance-delete/balance-delete.component'
import { BalanceEditComponent } from '@components/finance/balances/balance-edit/balance-edit.component'
import { BudgetAddComponent } from '@components/finance/budgets/budget-add/budget-add.component'
import { BudgetDashboardComponent } from '@components/finance/budgets/budget-dashboard/budget-dashboard.component'
import { BudgetDeleteComponent } from '@components/finance/budgets/budget-delete/budget-delete.component'
import { BudgetEditComponent } from '@components/finance/budgets/budget-edit/budget-edit.component'
import { BudgetListingComponent } from '@components/finance/budgets/budget-listing/budget-listing.component'
import { ExpenseAddComponent } from '@components/finance/expenses/expense-add/expense-add.component'
import { ExpenseDeleteComponent } from '@components/finance/expenses/expense-delete/expense-delete.component'
import { ExpenseEditComponent } from '@components/finance/expenses/expense-edit/expense-edit.component'
import { LoaderComponent } from '@components/finance/loader/loader.component'
import { RevenueAddComponent } from '@components/finance/revenues/revenue-add/revenue-add.component'
import { RevenueDeleteComponent } from '@components/finance/revenues/revenue-delete/revenue-delete.component'
import { RevenueEditComponent } from '@components/finance/revenues/revenue-edit/revenue-edit.component'
import { SnapshotHistoryComponent } from '@components/finance/snapshots/snapshot-history/snapshot-history.component'
import { SnapshotTableComponent } from '@components/finance/snapshots/snapshot-table/snapshot-table.component'
import { LayoutComponent } from '@components/ui/layout/layout.component'

// /budgets/add

// /budgets/Test/1
// /budgets/Test/1/add
// /budgets/Test/1/edit
// /budgets/Test/1/delete

// /budgets/Test/1/balances/add
// /budgets/Test/1/balances/edit/5
// /budgets/Test/1/balances/delete/5

// /budgets/Test/1/expenses/add
// /budgets/Test/1/expenses/edit/5
// /budgets/Test/1/expenses/delete/5

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LoaderComponent,
        children: [
          {
            path: '',
            component: BudgetListingComponent,
            children: [{ path: 'add', component: BudgetAddComponent }],
          },
        ],
      },
      {
        path: ':budgetId',
        component: LoaderComponent,
        children: [
          {
            path: '',
            component: BudgetDashboardComponent,
            children: [
              { path: 'add', component: BudgetAddComponent },
              { path: 'delete', component: BudgetDeleteComponent },
              { path: 'edit', component: BudgetEditComponent },
              { path: 'balances/add', component: BalanceAddComponent },
              { path: 'balance/:id/delete', component: BalanceDeleteComponent },
              { path: 'balance/:id/edit', component: BalanceEditComponent },
              { path: 'expenses/add', component: ExpenseAddComponent },
              { path: 'expense/:id/delete', component: ExpenseDeleteComponent },
              { path: 'expense/:id/edit', component: ExpenseEditComponent },
              { path: 'revenues/add', component: RevenueAddComponent },
              { path: 'revenue/:id/delete', component: RevenueDeleteComponent },
              { path: 'revenue/:id/edit', component: RevenueEditComponent },
              { path: 'snapshots/view', component: SnapshotHistoryComponent },
              { path: 'snapshots/add', component: SnapshotTableComponent },
            ],
          },
        ],
      },
    ],
  },
]
