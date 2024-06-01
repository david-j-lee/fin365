import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { ToolbarComponent } from '@components/ui/toolbar/toolbar.component'
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
    private activatedRoute: ActivatedRoute,
    private dalBudgetService: DalBudgetService,
  ) {}

  ngOnInit() {
    this.title.setTitle('fin365')

    this.getBudgets()

    this.activatedRoute.params.subscribe((params) => {
      if (params['budgetId'] === undefined) {
        this.financeService.selectedBudget = undefined
      }
    })
  }

  private getBudgets() {
    if (this.financeService.budgets === undefined) {
      this.dalBudgetService.getAll().subscribe((result) => {
        if (result) {
          this.financeService.budgets = result
          this.financeService.isLoaded = true
          return this.financeService.budgets
        }
        return
      })
    }
  }
}
