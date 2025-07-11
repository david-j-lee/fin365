import { Component, OnInit } from '@angular/core'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { Title } from '@angular/platform-browser'
import { RouterOutlet } from '@angular/router'
import { ToolbarComponent } from '@components/toolbar/toolbar.component'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ToolbarComponent, RouterOutlet, MatProgressSpinner],
})
export class AppComponent implements OnInit {
  constructor(
    public title: Title,
    public financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
  ) {
    // Inject
  }

  ngOnInit() {
    this.title.setTitle('fin365')

    this.getBudgets()
  }

  private getBudgets() {
    if (this.financeService.budgets === null) {
      this.dalBudgetService.getAll().subscribe((result) => {
        if (result) {
          this.financeService.budgets = result
          this.financeService.isLoaded = true
        }
      })
    }
  }
}
