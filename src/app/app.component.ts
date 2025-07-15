import { Component, OnInit, inject } from '@angular/core'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { Title } from '@angular/platform-browser'
import { RouterOutlet } from '@angular/router'
import { ToolbarComponent } from '@components/toolbar/toolbar.component'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ToolbarComponent, RouterOutlet, MatProgressSpinner],
})
export class AppComponent implements OnInit {
  title = inject(Title)
  financeService = inject(FinanceService)

  ngOnInit() {
    this.title.setTitle('fin365')

    this.getBudgets()
  }

  private getBudgets() {
    if (this.financeService.budgets === null) {
      this.financeService.loadBudgets()
    }
  }
}
