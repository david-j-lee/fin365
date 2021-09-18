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
import { DalRevenueService } from '../../../services/dal/dal.revenue.service';

import { Revenue } from '../../../interfaces/revenues/revenue.interface';
import { RevenueAdd } from '../../../interfaces/revenues/revenue-add.interface';

import { RevenueDeleteComponent } from '../revenue-delete/revenue-delete.component';

@Component({
  selector: 'app-revenue-edit',
  template: '',
})
export class RevenueEditComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueEditDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe((_parentParams) => {
        this.activatedRoute.params.subscribe((params) => {
          setTimeout(() => {
            this.matDialogRef = this.matDialog.open(
              RevenueEditDialogComponent,
              {
                data: { id: params['id'] },
              }
            );
          });
        });
      });
    }
  }
}

@Component({
  selector: 'app-revenue-edit-dialog',
  templateUrl: 'revenue-edit.component.html',
  styleUrls: ['revenue-edit.component.scss'],
})
export class RevenueEditDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  oldRevenue: Revenue | undefined;
  newRevenue: RevenueAdd | undefined;

  navigateToDelete = false;
  deleteModal: MatDialogRef<RevenueDeleteComponent> | null = null;

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private dalRevenueService: DalRevenueService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueEditDialogComponent> | null,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    // Get Balance
    if (this.financeService.selectedBudget?.revenues) {
      this.getData();
    } else if (this.financeService.selectedBudget) {
      this.dalRevenueService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result) => {
          if (result) {
            this.getData();
          }
        });
    }
  }

  setAfterClosed() {
    if (this.matDialogRef) {
      this.matDialogRef.afterClosed().subscribe((result: string) => {
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
              'revenue',
              this.oldRevenue?.id,
              'delete',
            ]);
          }
        }
      });
    }
  }

  getData() {
    // Get Revenue
    const revenue = this.financeService.selectedBudget?.revenues?.find(
      (x) => x.id == this.data.id
    );
    if (!revenue) {
      return;
    }
    this.oldRevenue = revenue;
    this.newRevenue = {
      description: this.oldRevenue.description,
      amount: this.oldRevenue.amount,
      isForever: this.oldRevenue.isForever,
      frequency: this.oldRevenue.frequency,
      startDate: this.oldRevenue.startDate,
      endDate: this.oldRevenue.endDate,
      repeatMon: this.oldRevenue.repeatMon,
      repeatTue: this.oldRevenue.repeatTue,
      repeatWed: this.oldRevenue.repeatWed,
      repeatThu: this.oldRevenue.repeatThu,
      repeatFri: this.oldRevenue.repeatFri,
      repeatSat: this.oldRevenue.repeatSat,
      repeatSun: this.oldRevenue.repeatSun,
      budgetId: undefined,
    };
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

    if (valid && this.oldRevenue) {
      this.dalRevenueService.update(this.oldRevenue, value).subscribe(
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
