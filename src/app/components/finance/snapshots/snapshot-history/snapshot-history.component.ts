import { CdkScrollable } from '@angular/cdk/scrolling'
import { DatePipe, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButton } from '@angular/material/button'
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table'
import { Router } from '@angular/router'
import { Snapshot } from '@interfaces/snapshots/snapshot.interface'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-snapshot-history',
  template: '',
  standalone: true,
})
export class SnapshotHistoryComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotHistoryDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      })
    })
  }
}

@Component({
  selector: 'app-snapshot-history-dialog',
  templateUrl: 'snapshot-history.component.html',
  styleUrls: ['snapshot-history.component.scss'],
  standalone: true,
  imports: [
    CdkScrollable,
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
  ],
})
export class SnapshotHistoryDialogComponent implements OnInit {
  displayColumns = [
    'date',
    'estimatedBalance',
    'actualBalance',
    'balanceDifference',
  ]
  dataSource = new MatTableDataSource<Snapshot>()

  constructor(
    public financeService: FinanceService,
    public matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent>,
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(
      this.financeService.selectedBudget?.snapshots,
    )
  }
}
