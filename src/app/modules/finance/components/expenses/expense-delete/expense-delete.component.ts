import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalExpenseService } from '../../../services/dal/dal.expense.service';

import { Expense } from '../../../interfaces/expenses/expense.interface';

@Component({
  selector: 'app-budget-add',
  template: '',
})
export class ExpenseDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            ExpenseDeleteDialogComponent,
            { data: { id: params.id } }
          );
          this.matDialogRef.afterClosed().subscribe((result: string) => {
            this.matDialogRef = null;
            // need to check action for navigation with back button
            const action =
              this.router.url.split('/')[this.router.url.split('/').length - 1];
            if (action !== 'edit') {
              this.router.navigate(['/', parentParams.budgetId]);
            }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-expense-delete-dialog',
  templateUrl: 'expense-delete.component.html',
  styleUrls: ['expense-delete.component.scss'],
})
export class ExpenseDeleteDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  deleteExpense: Expense | undefined;

  constructor(
    private financeService: FinanceService,
    private dalExpenseService: DalExpenseService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget?.expenses) {
      this.getData();
    } else if (this.financeService.selectedBudget) {
      this.dalExpenseService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result) => {
          this.getData();
        });
    }
  }

  getData() {
    // Get Balance
    const expense = this.financeService.selectedBudget?.expenses?.find(
      (x) => x.id == this.data.id
    );
    this.deleteExpense = expense;
  }

  delete() {
    if (this.deleteExpense) {
      this.dalExpenseService.delete(this.deleteExpense.id).subscribe(
        (result: any) => {
          this.matDialogRef.close();
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });
        },
        (errors: any) => {
          this.errors = errors;
        }
      );
    }
  }
}
