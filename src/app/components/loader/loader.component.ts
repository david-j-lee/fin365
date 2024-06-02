import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { Title } from '@angular/platform-browser'
import { RouterOutlet } from '@angular/router'
import { ToolbarComponent } from '@components/toolbar/toolbar.component'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-finance',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [ToolbarComponent, NgIf, RouterOutlet, MatProgressSpinner],
})
export class LoaderComponent implements OnInit {
  constructor(
    public financeService: FinanceService,
    private title: Title,
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
