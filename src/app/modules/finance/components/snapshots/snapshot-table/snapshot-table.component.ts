import { DailyService } from '../../../services/daily.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

import { FinanceService } from '../../../services/finance.service';
import { DalSnapshotService } from '../../../services/dal/dal.snapshot.service';

import { SnapshotAdd } from '../../../interfaces/snapshots/snapshot-add.interface';
import { SnapshotBalanceAdd } from '../../../interfaces/snapshots/snapshot-balance-add.interface';

@Component({
  selector: 'app-snapshot-table',
  template: '',
})
export class SnapshotTableComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotTableDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotTableDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate(['/', this.financeService.selectedBudget?.id]);
      });
    });
  }
}

@Component({
  selector: 'app-snapshot-table-dialog',
  templateUrl: 'snapshot-table.component.html',
  styleUrls: ['snapshot-table.component.scss'],
})
export class SnapshotTableDialogComponent implements OnInit {
  displayColumns = ['description', 'amount', 'delete'];
  dataSource = new MatTableDataSource<any>();
  addSnapshot: SnapshotAdd = {
    date: moment(),
    estimatedBalance: 0,
    actualBalance: 0,
  };
  balances: SnapshotBalanceAdd[] = [];
  isRequesting: boolean = false;

  constructor(
    private financeService: FinanceService,
    private dalSnapshotService: DalSnapshotService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<SnapshotTableDialogComponent>
  ) {}

  ngOnInit() {
    // create models to add balances to db
    if (this.financeService.selectedBudget?.balances) {
      this.financeService.selectedBudget.balances.forEach((balance: any) => {
        const balanceAdd: SnapshotBalanceAdd = {
          id: balance.id,
          description: balance.description,
          amount: balance.amount,
        };
        this.balances.push(balanceAdd);
      });
    }

    this.balances.push({} as SnapshotBalanceAdd);

    this.dataSource = new MatTableDataSource(this.balances);
  }

  update() {
    this.isRequesting = true;

    // send to db
    if (this.addSnapshot) {
      this.dalSnapshotService.save(this.addSnapshot, this.balances).subscribe(
        (_result: any) => {
          this.matDialogRef.close();
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
        },
        (_error) => {},
        () => {
          this.isRequesting = false;
        }
      );
    }
  }

  save(balance: SnapshotBalanceAdd) {
    if (balance.id === undefined) {
      balance.id = 0;
      this.balances.push({} as SnapshotBalanceAdd);
      this.dataSource = new MatTableDataSource(this.balances);
    }
  }

  delete(id: number) {
    if (id !== undefined) {
      // delete from items
      const balance = this.balances.find((x) => x.id == id);
      this.balances = this.balances.filter((x) => x !== balance);
      this.dataSource = new MatTableDataSource(this.balances);
    }
  }
}
