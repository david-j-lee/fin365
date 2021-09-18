import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { NavbarService, Modules } from '../ui/navbar/navbar.service';
import { FinanceService } from './services/finance.service';
import { DalBudgetService } from './services/dal/dal.budget.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  constructor(
    public financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private navBarService: NavbarService
  ) {}

  ngOnInit() {
    this.title.setTitle('fin365');
    this.navBarService.setToActive(Modules.budgets);

    this.getBudgets();

    this.activatedRoute.params.subscribe(params => {
      if (params.budgetId === undefined) {
        this.financeService.selectedBudget = undefined;
      }
    });
  }

  private getBudgets() {
    if (this.financeService.budgets === undefined) {
      this.dalBudgetService.getAll().subscribe(result => {
        if (result) {
          this.financeService.budgets = result;
          this.financeService.isLoaded = true;
          return this.financeService.budgets;
        }
        return;
      });
    }
  }
}
