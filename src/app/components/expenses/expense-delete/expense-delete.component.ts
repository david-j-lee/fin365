import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
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
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-delete-dialog',
  templateUrl: 'expense-delete.component.html',
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
export class ExpenseDeleteDialogComponent implements OnInit {
  matDialog = inject(MatDialog)
  matDialogRef =
    inject<MatDialogRef<ExpenseDeleteDialogComponent>>(MatDialogRef)
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)

  errors = ''
  isSubmitting = false

  deleteExpense: RuleRepeatable | undefined

  ngOnInit() {
    this.deleteExpense = this.financeService.budget?.expenses?.find(
      (expense) => expense.id === this.data.id,
    )
  }

  async delete() {
    if (!this.deleteExpense) {
      return
    }
    this.isSubmitting = true
    try {
      await this.financeService.deleteRule(this.deleteExpense)
      this.matDialogRef.close()
      this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
    } catch (error) {
      this.errors = error as string
    } finally {
      this.isSubmitting = false
    }
  }
}

@Component({
  selector: 'app-expense-delete',
  template: '',
  standalone: true,
})
export class ExpenseDeleteComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent> | null = null

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            ExpenseDeleteDialogComponent,
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
