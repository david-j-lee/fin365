import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalBudgetService } from '../../../services/dal/dal.budget.service';

import { Budget } from '../../../interfaces/budgets/budget.interface';
import { BudgetEdit } from '../../../interfaces/budgets/budget-edit.interface';

import { BudgetDeleteComponent } from '../budget-delete/budget-delete.component';

@Component({
  selector: 'app-budget-edit',
  template: '',
})
export class BudgetEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetEditDialogComponent> | null = null;

  constructor(public matDialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetEditDialogComponent);
    });
  }
}

@Component({
  selector: 'app-budget-edit-dialog',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss'],
})
export class BudgetEditDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  oldBudget: Budget | undefined;
  newBudget: BudgetEdit | undefined;

  navigateToDelete = false;
  deleteModal: MatDialogRef<BudgetDeleteComponent> | null = null;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetEditDialogComponent> | null
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    this.oldBudget = this.financeService.selectedBudget;
    if (this.oldBudget) {
      this.newBudget = {
        id: this.oldBudget.id,
        name: this.oldBudget.name,
        isActive: this.oldBudget.isActive,
      };
    }
  }

  setAfterClosed() {
    this.matDialogRef?.afterClosed().subscribe((result: string) => {
      this.matDialogRef = null;
      // need to check for navigation with forward button
      const action =
        this.router.url.split('/')[this.router.url.split('/').length - 1];
      if (action !== 'delete') {
        if (!this.navigateToDelete) {
          this.router.navigate(['/', this.financeService.selectedBudget?.id]);
        } else {
          this.router.navigate([
            '/',
            this.financeService.selectedBudget?.id,
            'delete',
          ]);
        }
      }
    });
  }

  requestDelete() {
    this.navigateToDelete = true;
    this.matDialogRef?.close();
  }

  edit(form: NgForm) {
    const { value, valid } = form;
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid && this.oldBudget) {
      value.id = this.oldBudget.id;
      this.dalBudgetService.update(this.oldBudget, value).subscribe(
        (result: any) => {
          this.matDialogRef?.close();
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
        },
        (errors: any) => {
          this.errors = errors;
        },
        () => {
          this.isRequesting = false;
        }
      );
    }
  }
}
