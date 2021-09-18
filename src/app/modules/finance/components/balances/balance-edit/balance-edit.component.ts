import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalBalanceService } from '../../../services/dal/dal.balance.service';

import { Balance } from '../../../interfaces/balances/balance.interface';
import { BalanceAdd } from '../../../interfaces/balances/balance-add.interface';

import { BalanceDeleteComponent } from '../balance-delete/balance-delete.component';

@Component({
  selector: 'app-balance-edit',
  template: '',
})
export class BalanceEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceEditDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((_parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(BalanceEditDialogComponent, {
            data: { id: params['id'] },
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-balance-edit-dialog',
  templateUrl: 'balance-edit.component.html',
  styleUrls: ['balance-edit.component.scss'],
})
export class BalanceEditDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  oldBalance: Balance | undefined;
  newBalance: BalanceAdd | undefined;

  navigateToDelete = false;
  deleteModal: MatDialogRef<BalanceDeleteComponent> | null = null;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceEditDialogComponent> | null,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    // Get Balance
    if (this.financeService.selectedBudget?.balances) {
      this.getData();
    } else if (this.financeService.selectedBudget) {
      this.dalBalanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result: any) => {
          if (result) {
            this.getData();
          }
        });
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
            './',
            this.financeService.selectedBudget?.id,
            'balance',
            this.oldBalance?.id,
            'delete',
          ]);
        }
      }
    });
  }

  getData() {
    const balance = this.financeService.selectedBudget?.balances?.find(
      (x: any) => x.id == this.data.id
    );
    this.oldBalance = balance;
    if (this.oldBalance) {
      this.newBalance = {
        description: this.oldBalance.description,
        amount: this.oldBalance.amount,
        budgetId: undefined,
      };
    }
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

    if (valid && this.oldBalance) {
      this.dalBalanceService.update(this.oldBalance, value).subscribe(
        (_result: any) => {
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
