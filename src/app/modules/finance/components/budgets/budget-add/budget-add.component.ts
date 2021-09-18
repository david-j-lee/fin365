import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { FinanceService } from '../../../services/finance.service';
import { DalBudgetService } from '../../../services/dal/dal.budget.service';

import { BudgetAdd } from '../../../interfaces/budgets/budget-add.interface';

@Component({
  selector: 'app-budget-add',
  template: '',
})
export class BudgetAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetAddDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        if (this.financeService.selectedBudget) {
          this.router.navigate(['/', this.financeService.selectedBudget.id]);
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }
}

@Component({
  selector: 'app-budget-add-dialog',
  templateUrl: 'budget-add.component.html',
  styleUrls: ['./budget-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetAddDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  myBudget: BudgetAdd | undefined;

  constructor(
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() };
  }

  create(form: NgForm) {
    const { value, valid } = form;

    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalBudgetService.add(value).subscribe(
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
