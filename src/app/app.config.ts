import { routes } from './app.routes'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideMomentDateAdapter } from '@angular/material-moment-adapter'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { CalendarService } from '@services/calendar.service'
import { ChartService } from '@services/chart.service'
import { DailyService } from '@services/daily.service'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { DalExpenseService } from '@services/dal/dal.expense.service'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { DalSnapshotService } from '@services/dal/dal.snapshot.service'
import { FinanceService } from '@services/finance.service'
import { LocalStorageBalanceService } from '@services/local-storage/local-storage.balance.service'
import { LocalStorageBudgetService } from '@services/local-storage/local-storage.budget.service'
import { LocalStorageExpenseService } from '@services/local-storage/local-storage.expense.service'
import { LocalStorageRevenueService } from '@services/local-storage/local-storage.revenue.service'
import { LocalStorageSnapshotService } from '@services/local-storage/local-storage.snapshot.service'
import { SideBarService } from '@services/side-bar.service'
import { ThemeService } from '@services/theme.service'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMomentDateAdapter(),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    { provide: CalendarService },
    { provide: ChartService },
    { provide: DailyService },
    { provide: DalBalanceService },
    { provide: DalBudgetService },
    { provide: DalExpenseService },
    { provide: DalRevenueService },
    { provide: DalSnapshotService },
    { provide: FinanceService },
    { provide: LocalStorageBalanceService },
    { provide: LocalStorageBudgetService },
    { provide: LocalStorageExpenseService },
    { provide: LocalStorageRevenueService },
    { provide: LocalStorageSnapshotService },
    { provide: ThemeService },
    { provide: SideBarService },
  ],
}
