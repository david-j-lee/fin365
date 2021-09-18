import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-snapshot-history',
  template: '',
})
export class SnapshotHistoryComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent> | null = null;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotHistoryDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate(['/', this.financeService.selectedBudget?.id]);
      });
    });
  }
}

@Component({
  selector: 'app-snapshot-history-dialog',
  templateUrl: 'snapshot-history.component.html',
  styleUrls: ['snapshot-history.component.scss'],
})
export class SnapshotHistoryDialogComponent implements OnInit {
  displayColumns = [
    'date',
    'estimatedBalance',
    'actualBalance',
    'balanceDifference',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public financeService: FinanceService,
    public matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent>
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(
      this.financeService.selectedBudget?.snapshots
    );
  }
}
