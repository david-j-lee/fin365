import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FinanceService } from '../../../services/finance.service';
import { DalRevenueService } from '../../../services/dal/dal.revenue.service';

import { RevenueAdd } from '../../../interfaces/revenues/revenue-add.interface';

@Component({
  selector: 'app-revenue-add',
  template: '',
})
export class RevenueAddComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueAddDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(RevenueAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate(['/', this.financeService.selectedBudget?.id]);
      });
    });
  }
}

@Component({
  selector: 'app-revenue-add-dialog',
  templateUrl: 'revenue-add.component.html',
  styleUrls: ['revenue-add.component.scss'],
})
export class RevenueAddDialogComponent implements OnInit {
  errors: string = '';
  isRequesting: boolean = false;
  submitted = false;

  myRevenue: RevenueAdd | undefined;

  constructor(
    public financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myRevenue = {
      budgetId: undefined,
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
      this.dalRevenueService.add(value).subscribe(
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
