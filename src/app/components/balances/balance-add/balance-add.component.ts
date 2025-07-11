import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import {
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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-add-dialog',
  templateUrl: 'balance-add.component.html',
  imports: [
    CdkScrollable,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    SpinnerComponent,
  ],
})
export class BalanceAddDialogComponent implements OnInit {
  financeService = inject(FinanceService)
  private dalBalanceService = inject(DalBalanceService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef = inject<MatDialogRef<BalanceAddDialogComponent>>(MatDialogRef)

  errors: string = ''
  isSubmitting: boolean = false
  myBalance: BalanceAdd | undefined

  ngOnInit() {
    const budgetId = this.financeService.selectedBudget?.id

    if (!budgetId) {
      return
    }

    this.myBalance = {
      budgetId,
      description: '',
      amount: 0,
    }
  }

  create(form: NgForm) {
    const { value, valid } = form
    if (valid && this.financeService.selectedBudget) {
      this.isSubmitting = true
      this.errors = ''
      value.budgetId = this.financeService.selectedBudget.id
      this.dalBalanceService.add(value).subscribe({
        next: () => {
          this.matDialogRef.close()
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
  selector: 'app-balance-add',
  template: '',
  standalone: true,
})
export class BalanceAddComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private financeService = inject(FinanceService)

  matDialogRef: MatDialogRef<BalanceAddDialogComponent> | null = null

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BalanceAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      })
    })
  }
}
