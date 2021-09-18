import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalBalanceService } from '../../../services/dal/dal.balance.service';

import { Balance } from '../../../interfaces/balances/balance.interface';

@Component({
  selector: 'app-balance-delete',
  template: '',
})
export class BalanceDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent> | null = null;

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
            BalanceDeleteDialogComponent,
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
  selector: 'app-balance-delete-dialog',
  templateUrl: 'balance-delete.component.html',
  styleUrls: ['balance-delete.component.scss'],
})
export class BalanceDeleteDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  deleteBalance: Balance | undefined;

  constructor(
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget?.balances) {
      this.getData();
    } else if (this.financeService.selectedBudget) {
      this.dalBalanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result) => {
          if (result) {
            this.getData();
          }
        });
    }
  }

  getData() {
    const balance = this.financeService.selectedBudget?.balances?.find(
      (x) => x.id == this.data.id
    );
    this.deleteBalance = balance;
  }

  delete() {
    if (this.deleteBalance) {
      this.dalBalanceService.delete(this.deleteBalance.id).subscribe(
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
