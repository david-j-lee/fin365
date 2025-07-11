import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { Budget } from '@interfaces/budgets/budget.interface'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-delete-dialog',
  templateUrl: 'budget-delete.component.html',
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
export class BudgetDeleteDialogComponent implements OnInit {
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private dalBudgetService = inject(DalBudgetService)
  matDialog = inject(MatDialog)
  matDialogRef = inject<MatDialogRef<BudgetDeleteDialogComponent> | null>(
    MatDialogRef<BudgetDeleteDialogComponent>,
  )

  errors = ''
  isSubmitting = false

  deleteBudget: Budget | null = null

  ngOnInit() {
    this.setAfterClose()
    this.deleteBudget = this.financeService.selectedBudget
  }

  setAfterClose() {
    if (this.matDialogRef) {
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        // Need to check action for navigation with back button
        const action =
          this.router.url.split('/')[this.router.url.split('/').length - 1]
        if (
          this.financeService.budgets &&
          this.financeService.budgets.length === 0
        ) {
          this.router.navigate(['/'])
        } else if (
          this.financeService.budgets &&
          this.financeService.budgets.length > 0
        ) {
          this.router.navigate(['/', this.financeService.budgets[0].id])
        } else if (action !== 'edit') {
          this.router.navigate(['/', this.financeService.selectedBudget?.id])
        }
      })
    }
  }

  delete() {
    if (this.deleteBudget) {
      this.isSubmitting = true
      this.dalBudgetService.delete(this.deleteBudget.id).subscribe({
        next: () => {
          this.matDialogRef?.close()
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
  selector: 'app-budget-delete',
  template: '',
  standalone: true,
})
export class BudgetDeleteComponent implements OnInit {
  matDialog = inject(MatDialog)

  matDialogRef: MatDialogRef<BudgetDeleteDialogComponent> | null = null

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetDeleteDialogComponent)
    })
  }
}
