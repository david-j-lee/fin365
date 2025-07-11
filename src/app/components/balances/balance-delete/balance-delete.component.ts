import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, Inject, OnInit } from '@angular/core'
import { MatButton } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { Balance } from '@interfaces/balances/balance.interface'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-delete-dialog',
  templateUrl: 'balance-delete.component.html',
  imports: [
    CdkScrollable,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    SpinnerComponent,
  ],
})
export class BalanceDeleteDialogComponent implements OnInit {
  errors: string = ''
  isSubmitting: boolean = false

  deleteBalance: Balance | undefined

  constructor(
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {
    // Inject
  }

  ngOnInit() {
    if (this.financeService.selectedBudget?.balances) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalBalanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result) => {
          if (result) {
            this.getData()
          }
        })
    }
  }

  getData() {
    const balanceToDelete = this.financeService.selectedBudget?.balances?.find(
      (balance) => balance.id === this.data.id,
    )
    this.deleteBalance = balanceToDelete
  }

  delete() {
    if (this.deleteBalance) {
      this.isSubmitting = true
      this.dalBalanceService.delete(this.deleteBalance.id).subscribe({
        next: () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
        },
        error: (errors) => {
          this.errors = errors
        },
        complete: () => {
          this.isSubmitting = false
        },
      })
    }
  }
}

@Component({
  selector: 'app-balance-delete',
  template: '',
  standalone: true,
})
export class BalanceDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Inject
  }

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            BalanceDeleteDialogComponent,
            { data: { id: params['id'] } },
          )
          this.matDialogRef.afterClosed().subscribe(() => {
            this.matDialogRef = null
            // Need to check action for navigation with back button
            const action =
              this.router.url.split('/')[this.router.url.split('/').length - 1]
            if (action !== 'edit') {
              this.router.navigate(['/', parentParams['budgetId']])
            }
          })
        })
      })
    })
  }
}
