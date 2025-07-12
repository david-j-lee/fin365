import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
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
import { RuleAdd } from '@interfaces/rules/rule-add.interface'
import { Rule } from '@interfaces/rules/rule.interface'
import { DalRuleService } from '@services/dal/dal.rule.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-edit-dialog',
  templateUrl: 'balance-edit.component.html',
  imports: [
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
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private dalBalanceService = inject(DalRuleService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef = inject<MatDialogRef<BalanceEditDialogComponent> | null>(
    MatDialogRef<BalanceEditDialogComponent>,
  )
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldBalance: Rule | undefined
  newBalance: RuleAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<BalanceDeleteComponent> | null = null

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
    if (this.financeService.budget?.balances) {
      this.getData()
    } else if (this.financeService.budget) {
      this.dalBalanceService
        .getAll('balances', this.financeService.budget.id)
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
          this.financeService.budget?.id,
          'balance',
          this.oldBalance?.id,
          'delete',
        ])
      } else {
        this.router.navigate(['/', this.financeService.budget?.id])
      }
    })
  }

  getData() {
    const oldBalance = this.financeService.budget?.balances?.find(
      (balance) => balance.id === this.data.id,
    )
    this.oldBalance = oldBalance
    if (this.oldBalance) {
      this.newBalance = {
        type: 'balance',
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
      this.dalBalanceService
        .update('balances', this.oldBalance, value)
        .subscribe({
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
  matDialog = inject(MatDialog)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<BalanceEditDialogComponent> | null = null

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
