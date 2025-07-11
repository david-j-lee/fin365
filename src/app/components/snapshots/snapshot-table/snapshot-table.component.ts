import { CdkScrollable } from '@angular/cdk/scrolling'
import { CurrencyPipe } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
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
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { SnapshotAdd } from '@interfaces/snapshots/snapshot-add.interface'
import { SnapshotBalanceAdd } from '@interfaces/snapshots/snapshot-balance-add.interface'
import { DailyService } from '@services/daily.service'
import { DalSnapshotService } from '@services/dal/dal.snapshot.service'
import { FinanceService } from '@services/finance.service'
import { getRansomStringFromObject } from '@utilities/string-utilities'
import moment from 'moment'

@Component({
  selector: 'app-snapshot-table-dialog',
  templateUrl: 'snapshot-table.component.html',
  styleUrls: ['snapshot-table.component.scss'],
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
    SpinnerComponent,
  ],
})
export class SnapshotTableDialogComponent implements OnInit {
  private financeService = inject(FinanceService)
  private dailyService = inject(DailyService)
  private dalSnapshotService = inject(DalSnapshotService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef =
    inject<MatDialogRef<SnapshotTableDialogComponent>>(MatDialogRef)

  mostRecentSnapshotDate = this.financeService.getMostRecentSnapshotDate()
  estimatedTotalBalance = this.dailyService.getBalanceForGivenDay(
    this.mostRecentSnapshotDate?.format('MM/DD/YYYY') ?? '',
  )
  displayColumns = ['description', 'amount', 'delete']
  dataSource = new MatTableDataSource<SnapshotBalanceAdd>()
  addSnapshot: SnapshotAdd = {
    budgetId: this.financeService.budget?.id ?? '',
    date: this.mostRecentSnapshotDate ?? moment(),
    estimatedBalance: 0,
    actualBalance: 0,
  }
  balances: SnapshotBalanceAdd[] = []
  isSubmitting = false

  ngOnInit() {
    // Create models to add balances to db
    if (this.financeService.budget?.balances) {
      this.financeService.budget.balances.forEach((balance) => {
        const balanceAdd: SnapshotBalanceAdd = {
          id: balance.id,
          description: balance.description,
          amount: balance.amount,
        }
        this.balances.push(balanceAdd)
      })
    }

    this.balances.push({
      id: '',
      description: '',
      amount: 0,
    })

    this.dataSource = new MatTableDataSource(this.balances)
  }

  onDatePickerChange() {
    this.estimatedTotalBalance = this.dailyService.getBalanceForGivenDay(
      this.addSnapshot.date.format('MM/DD/YYYY'),
    )
  }

  update() {
    const budgetId = this.financeService.budget?.id
    if (budgetId && this.addSnapshot) {
      this.isSubmitting = true
      this.addSnapshot.budgetId = budgetId
      this.dalSnapshotService.save(this.addSnapshot, this.balances).subscribe({
        next: () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
        },
        error: (error) => {
          console.error(error)
        },
        complete: () => {
          this.isSubmitting = false
        },
      })
    }
  }

  save(balance: SnapshotBalanceAdd) {
    // When user updates the last row (no id)
    if (!balance.id) {
      // Update the last row so it has an ID now
      balance.id = this.getSnapshotBalanceId()
      // Add another empty row
      this.balances.push({
        id: '',
        description: '',
        amount: 0,
      })
      this.dataSource = new MatTableDataSource(this.balances)
    }
  }

  delete(id: string) {
    if (id) {
      const balanceToDelete = this.balances.find((balance) => balance.id === id)
      this.balances = this.balances.filter(
        (balance) => balance !== balanceToDelete,
      )
      this.dataSource = new MatTableDataSource(this.balances)
    }
  }

  getSnapshotBalanceId() {
    return getRansomStringFromObject(
      this.balances.reduce(
        (accumulator: Record<string, SnapshotBalanceAdd>, item) => {
          accumulator[item.id] = item
          return accumulator
        },
        {},
      ),
    )
  }
}

@Component({
  selector: 'app-snapshot-table',
  template: '',
  standalone: true,
})
export class SnapshotTableComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private financeService = inject(FinanceService)

  matDialogRef: MatDialogRef<SnapshotTableDialogComponent> | null = null

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotTableDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.budget?.id])
      })
    })
  }
}
