import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinanceRouting } from './finance.routing';
import { MaterialModule } from '../material/material.module';
import { UiModule } from '../ui/ui.module';
import { CoreModule } from '../../core/core.module';
import { NgChartsModule } from 'ng2-charts';

// Services
import { FinanceService } from './services/finance.service';

import { WebApiBalanceService } from './services/web-api/web-api.balance.service';
import { WebApiBudgetService } from './services/web-api/web-api.budget.service';
import { WebApiExpenseService } from './services/web-api/web-api.expense.service';
import { WebApiRevenueService } from './services/web-api/web-api.revenue.service';
import { WebApiSnapshotService } from './services/web-api/web-api.snapshot.service';

import { LocalStorageBalanceService } from './services/local-storage/local-storage.balance.service';
import { LocalStorageBudgetService } from './services/local-storage/local-storage.budget.service';
import { LocalStorageExpenseService } from './services/local-storage/local-storage.expense.service';
import { LocalStorageRevenueService } from './services/local-storage/local-storage.revenue.service';
import { LocalStorageSnapshotService } from './services/local-storage/local-storage.snapshot.service';

import { DalBalanceService } from './services/dal/dal.balance.service';
import { DalBudgetService } from './services/dal/dal.budget.service';
import { DalExpenseService } from './services/dal/dal.expense.service';
import { DalRevenueService } from './services/dal/dal.revenue.service';
import { DalSnapshotService } from './services/dal/dal.snapshot.service';

import { SideBarService } from './services/side-bar.service';

import { DailyService } from './services/daily.service';
import { ChartService } from './services/chart.service';
import { CalendarService } from './services/calendar.service';

// Components
import { FinanceComponent } from './finance.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CalendarComponent } from './components/calendar/calendar.component';

// balances
import {
  BalanceAddComponent,
  BalanceAddDialogComponent
} from './components/balances/balance-add/balance-add.component';
import {
  BalanceDeleteComponent,
  BalanceDeleteDialogComponent
} from './components/balances/balance-delete/balance-delete.component';
import {
  BalanceEditComponent,
  BalanceEditDialogComponent
} from './components/balances/balance-edit/balance-edit.component';
import { BalancePieChartComponent } from './components/balances/balance-pie-chart/balance-pie-chart.component';
import { BalanceTableComponent } from './components/balances/balance-table/balance-table.component';

// budgets
import {
  BudgetAddComponent,
  BudgetAddDialogComponent
} from './components/budgets/budget-add/budget-add.component';
import { BudgetChartComponent } from './components/budgets/budget-chart/budget-chart.component';
import {
  BudgetDeleteComponent,
  BudgetDeleteDialogComponent
} from './components/budgets/budget-delete/budget-delete.component';
import {
  BudgetEditComponent,
  BudgetEditDialogComponent
} from './components/budgets/budget-edit/budget-edit.component';
import { BudgetListingComponent } from './components/budgets/budget-listing/budget-listing.component';
import { BudgetDashboardComponent } from './components/budgets/budget-dashboard/budget-dashboard.component';

// expenses
import {
  ExpenseAddComponent,
  ExpenseAddDialogComponent
} from './components/expenses/expense-add/expense-add.component';
import {
  ExpenseDeleteComponent,
  ExpenseDeleteDialogComponent
} from './components/expenses/expense-delete/expense-delete.component';
import {
  ExpenseEditComponent,
  ExpenseEditDialogComponent
} from './components/expenses/expense-edit/expense-edit.component';
import { ExpensePieChartComponent } from './components/expenses/expense-pie-chart/expense-pie-chart.component';
import { ExpenseTableComponent } from './components/expenses/expense-table/expense-table.component';

// revenues
import {
  RevenueAddComponent,
  RevenueAddDialogComponent
} from './components/revenues/revenue-add/revenue-add.component';
import {
  RevenueDeleteComponent,
  RevenueDeleteDialogComponent
} from './components/revenues/revenue-delete/revenue-delete.component';
import {
  RevenueEditComponent,
  RevenueEditDialogComponent
} from './components/revenues/revenue-edit/revenue-edit.component';
import { RevenuePieChartComponent } from './components/revenues/revenue-pie-chart/revenue-pie-chart.component';
import { RevenueTableComponent } from './components/revenues/revenue-table/revenue-table.component';

// snapshots
import {
  SnapshotHistoryComponent,
  SnapshotHistoryDialogComponent
} from './components/snapshots/snapshot-history/snapshot-history.component';
import {
  SnapshotTableComponent,
  SnapshotTableDialogComponent
} from './components/snapshots/snapshot-table/snapshot-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    UiModule,
    NgChartsModule,
    FinanceRouting
  ],
  declarations: [
    BalanceAddComponent,
    BalanceAddDialogComponent,
    BalanceDeleteComponent,
    BalanceDeleteDialogComponent,
    BalanceEditComponent,
    BalanceEditDialogComponent,
    BalancePieChartComponent,
    BalanceTableComponent,
    BudgetAddComponent,
    BudgetAddDialogComponent,
    BudgetChartComponent,
    BudgetDashboardComponent,
    BudgetDeleteComponent,
    BudgetDeleteDialogComponent,
    BudgetEditComponent,
    BudgetEditDialogComponent,
    BudgetListingComponent,
    CalendarComponent,
    ExpenseAddComponent,
    ExpenseAddDialogComponent,
    ExpenseDeleteComponent,
    ExpenseDeleteDialogComponent,
    ExpenseEditComponent,
    ExpenseEditDialogComponent,
    ExpensePieChartComponent,
    ExpenseTableComponent,
    FinanceComponent,
    GettingStartedComponent,
    RevenueAddComponent,
    RevenueAddDialogComponent,
    RevenueDeleteComponent,
    RevenueDeleteDialogComponent,
    RevenueEditComponent,
    RevenueEditDialogComponent,
    RevenuePieChartComponent,
    RevenueTableComponent,
    SidebarComponent,
    SnapshotHistoryComponent,
    SnapshotHistoryDialogComponent,
    SnapshotTableComponent,
    SnapshotTableDialogComponent,
    ToolbarComponent,
    WizardComponent
  ],
  providers: [
    WebApiBalanceService,
    WebApiBudgetService,
    WebApiExpenseService,
    WebApiRevenueService,
    WebApiSnapshotService,
    LocalStorageBalanceService,
    LocalStorageBudgetService,
    LocalStorageExpenseService,
    LocalStorageRevenueService,
    LocalStorageSnapshotService,
    DalBalanceService,
    DalBudgetService,
    DalExpenseService,
    DalRevenueService,
    DalSnapshotService,
    FinanceService,
    SideBarService,
    DailyService,
    ChartService,
    CalendarService
  ],
  entryComponents: [
    BalanceAddDialogComponent,
    BalanceDeleteDialogComponent,
    BalanceEditDialogComponent,
    BudgetAddDialogComponent,
    BudgetEditDialogComponent,
    BudgetDeleteDialogComponent,
    ExpenseAddDialogComponent,
    ExpenseDeleteDialogComponent,
    ExpenseEditDialogComponent,
    RevenueAddDialogComponent,
    RevenueDeleteDialogComponent,
    RevenueEditDialogComponent,
    SnapshotHistoryDialogComponent,
    SnapshotTableDialogComponent
  ]
})
export class FinanceModule {}
