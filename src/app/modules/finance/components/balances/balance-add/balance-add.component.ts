import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalBalanceService } from '../../../services/dal/dal.balance.service';

import { BalanceAdd } from '../../../interfaces/balances/balance-add.interface';

@Component({
  selector: 'app-balance-add',
  template: '',
})
export class BalanceAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceAddDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BalanceAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((_result: string) => {
        this.matDialogRef = null;
        this.router.navigate(['/', this.financeService.selectedBudget?.id]);
      });
    });
  }
}

@Component({
  selector: 'app-balance-add-dialog',
  templateUrl: 'balance-add.component.html',
  styleUrls: ['balance-add.component.scss'],
})
export class BalanceAddDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  myBalance: BalanceAdd | undefined;

  constructor(
    public financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myBalance = {
      budgetId: undefined,
      description: '',
      amount: 0,
    };
  }

  create(form: NgForm) {
    const { value, valid } = form;

    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid && this.financeService.selectedBudget) {
      value.budgetId = this.financeService.selectedBudget.id;
      this.dalBalanceService.add(value).subscribe(
        (_result: any) => {
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
