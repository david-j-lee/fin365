import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
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
import { MatError, MatFormField, MatHint } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { BalanceDeleteComponent } from '@components/balances/balance-delete/balance-delete.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { Balance } from '@interfaces/balances/balance.interface'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-edit-dialog',
  templateUrl: 'balance-edit.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatHint,
    MatError,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    SpinnerComponent,
  ],
})
export class BalanceEditDialogComponent implements OnInit {
  errors: string = ''
  isSubmitting: boolean = false

  oldBalance: Balance | undefined
  newBalance: BalanceAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<BalanceDeleteComponent> | null = null

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceEditDialogComponent> | null,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {
    // Inject
  }

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
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

  setAfterClosed() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      // Need to check for navigation with forward button
      const action =
        this.router.url.split('/')[this.router.url.split('/').length - 1]
      if (action === 'delete') {
        return
      }
      if (this.navigateToDelete) {
        this.router.navigate([
          './',
          this.financeService.selectedBudget?.id,
          'balance',
          this.oldBalance?.id,
          'delete',
        ])
      } else {
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      }
    })
  }

  getData() {
    const oldBalance = this.financeService.selectedBudget?.balances?.find(
      (balance) => balance.id === this.data.id,
    )
    this.oldBalance = oldBalance
    if (this.oldBalance) {
      this.newBalance = {
        description: this.oldBalance.description,
        amount: this.oldBalance.amount,
        budgetId: this.oldBalance.budgetId,
      }
    }
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  edit(form: NgForm) {
    const { value, valid } = form
    if (valid && this.oldBalance) {
      this.isSubmitting = true
      this.errors = ''
      this.dalBalanceService.update(this.oldBalance, value).subscribe({
        next: () => {
          this.matDialogRef?.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
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
  selector: 'app-balance-edit',
  template: '',
  standalone: true,
})
export class BalanceEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceEditDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    // Inject
  }

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe(() => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(BalanceEditDialogComponent, {
            data: { id: params['id'] },
          })
        })
      })
    })
  }
}
