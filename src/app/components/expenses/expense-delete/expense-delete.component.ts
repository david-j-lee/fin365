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
import { Expense } from '@interfaces/expenses/expense.interface'
import { DalExpenseService } from '@services/dal/dal.expense.service'
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
  private financeService = inject(FinanceService)
  private dalExpenseService = inject(DalExpenseService)
  matDialog = inject(MatDialog)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef =
    inject<MatDialogRef<ExpenseDeleteDialogComponent>>(MatDialogRef)
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  deleteExpense: Expense | undefined

  ngOnInit() {
    if (this.financeService.budget?.expenses) {
      this.getData()
    } else if (this.financeService.budget) {
      this.dalExpenseService
        .getAll(this.financeService.budget.id)
        .subscribe(() => {
          this.getData()
        })
    }
  }

  getData() {
    // Get Balance
    const expenseToDelete = this.financeService.budget?.expenses?.find(
      (expense) => expense.id === this.data.id,
    )
    this.deleteExpense = expenseToDelete
  }

  delete() {
    if (this.deleteExpense) {
      this.isSubmitting = true
      this.dalExpenseService.delete(this.deleteExpense.id).subscribe({
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
  selector: 'app-budget-add',
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
