import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalExpenseService } from '../../../services/dal/dal.expense.service';

import { ExpenseAdd } from '../../../interfaces/expenses/expense-add.interface';

@Component({
  selector: 'app-expense-add',
  template: '',
})
export class ExpenseAddComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseAddDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ExpenseAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate(['/', this.financeService.selectedBudget?.id]);
      });
    });
  }
}

@Component({
  selector: 'app-expense-add-dialog',
  templateUrl: 'expense-add.component.html',
  styleUrls: ['expense-add.component.scss'],
})
export class ExpenseAddDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  myExpense: ExpenseAdd | undefined;

  constructor(
    public financeService: FinanceService,
    private dalExpenseService: DalExpenseService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myExpense = {
      budgetId: 0,
      description: '',
      amount: 0,
      isForever: true,
      frequency: '',
      startDate: this.financeService.getFirstDate(),
      endDate: undefined,
      repeatMon: false,
      repeatTue: false,
      repeatWed: false,
      repeatThu: false,
      repeatFri: false,
      repeatSat: false,
      repeatSun: false,
    };
  }

  create(form: NgForm) {
    const { value, valid } = form;

    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalExpenseService.add(value).subscribe(
        (result: any) => {
          this.matDialogRef.close();
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
