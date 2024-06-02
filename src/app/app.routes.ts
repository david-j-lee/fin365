import { Routes } from '@angular/router'
import { BalanceAddComponent } from '@components/balances/balance-add/balance-add.component'
import { BalanceDeleteComponent } from '@components/balances/balance-delete/balance-delete.component'
import { BalanceEditComponent } from '@components/balances/balance-edit/balance-edit.component'
import { BudgetAddComponent } from '@components/budgets/budget-add/budget-add.component'
import { BudgetDashboardComponent } from '@components/budgets/budget-dashboard/budget-dashboard.component'
import { BudgetDeleteComponent } from '@components/budgets/budget-delete/budget-delete.component'
import { BudgetEditComponent } from '@components/budgets/budget-edit/budget-edit.component'
import { BudgetListingComponent } from '@components/budgets/budget-listing/budget-listing.component'
import { ExpenseAddComponent } from '@components/expenses/expense-add/expense-add.component'
import { ExpenseDeleteComponent } from '@components/expenses/expense-delete/expense-delete.component'
import { ExpenseEditComponent } from '@components/expenses/expense-edit/expense-edit.component'
import { LayoutComponent } from '@components/layout/layout.component'
import { LoaderComponent } from '@components/loader/loader.component'
import { RevenueAddComponent } from '@components/revenues/revenue-add/revenue-add.component'
import { RevenueDeleteComponent } from '@components/revenues/revenue-delete/revenue-delete.component'
import { RevenueEditComponent } from '@components/revenues/revenue-edit/revenue-edit.component'
import { SnapshotHistoryComponent } from '@components/snapshots/snapshot-history/snapshot-history.component'
import { SnapshotTableComponent } from '@components/snapshots/snapshot-table/snapshot-table.component'

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
