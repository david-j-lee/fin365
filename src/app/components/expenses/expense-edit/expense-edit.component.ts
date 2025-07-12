import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatOption } from '@angular/material/core'
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import {
  MatError,
  MatFormField,
  MatHint,
  MatSuffix,
} from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatSelect } from '@angular/material/select'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { ExpenseDeleteComponent } from '@components/expenses/expense-delete/expense-delete.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { RepeatableRuleAdd } from '@interfaces/rules/repeatable-rule-add.interface'
import { RepeatableRule } from '@interfaces/rules/repeatable-rule.interface'
import { DalRepeatableRuleService } from '@services/dal/dal.repeatable-rule.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-edit-dialog',
  templateUrl: 'expense-edit.component.html',
  imports: [
    CdkScrollable,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    MatSuffix,
    SpinnerComponent,
  ],
})
export class ExpenseEditDialogComponent implements OnInit {
  financeService = inject(FinanceService)
  private router = inject(Router)
  private dalExpenseService = inject(DalRepeatableRuleService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef = inject<MatDialogRef<ExpenseEditDialogComponent> | null>(
    MatDialogRef<ExpenseEditDialogComponent>,
  )
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldExpense: RepeatableRule | undefined
  newExpense: RepeatableRuleAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<ExpenseDeleteComponent> | null = null

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
    if (this.financeService.budget?.expenses) {
      this.getData()
    } else if (this.financeService.budget) {
      this.dalExpenseService
        .getAll('expenses', this.financeService.budget.id)
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
      if (action !== 'delete') {
        if (this.navigateToDelete) {
          this.router.navigate([
            './',
            this.financeService.budget?.id,
            'expense',
            this.oldExpense?.id,
            'delete',
          ])
        } else {
          this.router.navigate(['/', this.financeService.budget?.id])
        }
      }
    })
  }

  getData() {
    // Get Balance
    const expense = this.financeService.budget?.expenses?.find(
      (budgetExpense) => budgetExpense.id === this.data.id,
    )
    this.oldExpense = expense
    if (this.oldExpense) {
      this.newExpense = {
        type: 'expense',
        budgetId: this.oldExpense.budgetId,
        description: this.oldExpense.description,
        amount: this.oldExpense.amount,
        isForever: this.oldExpense.isForever,
        frequency: this.oldExpense.frequency,
        startDate: this.oldExpense.startDate,
        endDate: this.oldExpense.endDate,
        repeatMon: this.oldExpense.repeatMon,
        repeatTue: this.oldExpense.repeatTue,
        repeatWed: this.oldExpense.repeatWed,
        repeatThu: this.oldExpense.repeatThu,
        repeatFri: this.oldExpense.repeatFri,
        repeatSat: this.oldExpense.repeatSat,
        repeatSun: this.oldExpense.repeatSun,
      }
    }
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  edit(form: NgForm) {
    const { value, valid } = form
    if (valid && this.oldExpense) {
      this.isSubmitting = true
      this.errors = ''
      this.dalExpenseService
        .update('expenses', this.oldExpense, value)
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
  selector: 'app-expense-edit',
  template: '',
  standalone: true,
})
export class ExpenseEditComponent implements OnInit {
  matDialog = inject(MatDialog)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<ExpenseEditDialogComponent> | null = null

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe(() => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(ExpenseEditDialogComponent, {
            data: { id: params['id'] },
          })
        })
      })
    })
  }
}
