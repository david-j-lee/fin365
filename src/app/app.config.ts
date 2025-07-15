import { routes } from './app.routes'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter'
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter, withRouterConfig } from '@angular/router'
import { CalendarService } from '@services/calendar.service'
import { FinanceService } from '@services/finance.service'
import { SideBarService } from '@services/side-bar.service'
import { ThemeService } from '@services/theme.service'
import { enUS } from 'date-fns/locale'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    { provide: CalendarService },
    { provide: FinanceService },
    { provide: ThemeService },
    { provide: SideBarService },
  ],
}
