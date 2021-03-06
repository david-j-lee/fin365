import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FinanceService } from '../../../services/finance.service';
import { DalBudgetService } from '../../../services/dal/dal.budget.service';

import { Budget } from '../../../interfaces/budgets/budget.interface';

@Component({
  selector: 'app-budget-delete',
  template: '',
})
export class BudgetDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetDeleteDialogComponent> | null = null;

  constructor(public matDialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetDeleteDialogComponent);
    });
  }
}

@Component({
  selector: 'app-budget-delete-dialog',
  templateUrl: 'budget-delete.component.html',
  styleUrls: ['./budget-delete.component.scss'],
})
export class BudgetDeleteDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  deleteBudget: Budget | undefined;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    public matDialog: MatDialog,
    public matDialogRef: MatDialogRef<BudgetDeleteDialogComponent> | null
  ) {}

  ngOnInit() {
    this.setAfterClose();
    this.deleteBudget = this.financeService.selectedBudget;
  }

  setAfterClose() {
    if (this.matDialogRef) {
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        // need to check action for navigation with back button
        const action =
          this.router.url.split('/')[this.router.url.split('/').length - 1];
        if (
          this.financeService.budgets &&
          this.financeService.budgets.length === 0
        ) {
          this.router.navigate(['/']);
        } else if (
          this.financeService.budgets &&
          this.financeService.budgets.length > 0
        ) {
          this.router.navigate(['/budget', this.financeService.budgets[0].id]);
        } else if (action !== 'edit') {
          this.router.navigate(['/', this.financeService.selectedBudget?.id]);
        }
      });
    }
  }

  delete() {
    if (this.deleteBudget) {
      this.dalBudgetService.delete(this.deleteBudget.id).subscribe(
        (result: any) => {
          this.matDialogRef?.close();
        },
        (errors: any) => {
          this.errors = errors;
        }
      );
    }
  }
}
