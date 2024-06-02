import { CdkScrollable } from '@angular/cdk/scrolling'
import { CurrencyPipe, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButton, MatIconButton } from '@angular/material/button'
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker'
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatError, MatFormField, MatSuffix } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
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
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { SnapshotAdd } from '@interfaces/snapshots/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshots/snapshot-balance-add.interface'
import { DailyService } from '@services/daily.service'
import { DalSnapshotService } from '@services/dal/dal.snapshot.service'
import { FinanceService } from '@services/finance.service'
import moment from 'moment'

@Component({
  selector: 'app-snapshot-table',
  template: '',
  standalone: true,
})
export class SnapshotTableComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotTableDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotTableDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      })
    })
  }
}

@Component({
  selector: 'app-snapshot-table-dialog',
  templateUrl: 'snapshot-table.component.html',
  styleUrls: ['snapshot-table.component.scss'],
  standalone: true,
  imports: [
    CdkScrollable,
    CurrencyPipe,
    FormsModule,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatRow,
    MatRowDef,
    MatSuffix,
    MatTable,
    NgIf,
    SpinnerComponent,
  ],
})
export class SnapshotTableDialogComponent implements OnInit {
  mostRecentSnapshotDate = this.financeService.getMostRecentSnapshotDate()
  estimatedTotalBalance = this.dailyService.getBalanceForGivenDay(
    this.mostRecentSnapshotDate?.format('MM/DD/YYYY') ?? '',
  )
  displayColumns = ['description', 'amount', 'delete']
  dataSource = new MatTableDataSource<SnapshotBalanceAdd>()
  addSnapshot: SnapshotAdd = {
    date: this.mostRecentSnapshotDate ?? moment(),
    estimatedBalance: 0,
    actualBalance: 0,
  }
  balances: SnapshotBalanceAdd[] = []
  isRequesting: boolean = false

  constructor(
    private financeService: FinanceService,
    private dailyService: DailyService,
    private dalSnapshotService: DalSnapshotService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<SnapshotTableDialogComponent>,
  ) {}

  ngOnInit() {
    // create models to add balances to db
    if (this.financeService.selectedBudget?.balances) {
      this.financeService.selectedBudget.balances.forEach((balance) => {
        const balanceAdd: SnapshotBalanceAdd = {
          id: balance.id,
          description: balance.description,
          amount: balance.amount,
        }
        this.balances.push(balanceAdd)
      })
    }

    this.balances.push({} as SnapshotBalanceAdd)

    this.dataSource = new MatTableDataSource(this.balances)
  }

  onDatePickerChange() {
    this.estimatedTotalBalance = this.dailyService.getBalanceForGivenDay(
      this.addSnapshot.date.format('MM/DD/YYYY'),
    )
  }

  update() {
    this.isRequesting = true

    // send to db
    if (this.addSnapshot) {
      this.dalSnapshotService.save(this.addSnapshot, this.balances).subscribe({
        next: () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
        },
        error: () => {},
        complete: () => {
          this.isRequesting = false
        },
      })
    }
  }

  save(balance: SnapshotBalanceAdd) {
    if (balance.id === undefined) {
      balance.id = '0'
      this.balances.push({} as SnapshotBalanceAdd)
      this.dataSource = new MatTableDataSource(this.balances)
    }
  }

  delete(id: string) {
    if (id !== undefined) {
      // delete from items
      const balance = this.balances.find((x) => x.id === id)
      this.balances = this.balances.filter((x) => x !== balance)
      this.dataSource = new MatTableDataSource(this.balances)
    }
  }
}
