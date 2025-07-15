import { CdkScrollable } from '@angular/cdk/scrolling'
import { DatePipe } from '@angular/common'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { Snapshot } from '@interfaces/snapshot.interface'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-snapshot-history-dialog',
  templateUrl: 'snapshot-history.component.html',
  styleUrls: ['snapshot-history.component.scss'],
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
  ],
})
export class SnapshotHistoryDialogComponent implements OnInit {
  financeService = inject(FinanceService)
  private router = inject(Router)
  private matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent> | null =
    inject(MatDialogRef<SnapshotHistoryDialogComponent>)

  displayColumns = [
    'date',
    'estimatedBalance',
    'actualBalance',
    'balanceDifference',
  ]
  dataSource = new MatTableDataSource<Snapshot>()

  ngOnInit() {
    this.dataSource = new MatTableDataSource(
      this.financeService.budget?.snapshots(),
    )

    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      this.router.navigate(['/', this.financeService.budget?.id])
    })
  }
}

@Component({
  selector: 'app-snapshot-history',
  template: '',
  standalone: true,
})
export class SnapshotHistoryComponent implements AfterViewInit {
  private matDialog = inject(MatDialog)

  ngAfterViewInit() {
    this.matDialog.open(SnapshotHistoryDialogComponent)
  }
}
