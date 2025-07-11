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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { ExpenseAdd } from '@interfaces/expenses/expense-add.interface'
import { DalExpenseService } from '@services/dal/dal.expense.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-add-dialog',
  templateUrl: 'expense-add.component.html',
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
export class ExpenseAddDialogComponent implements OnInit {
  financeService = inject(FinanceService)
  private dalExpenseService = inject(DalExpenseService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef = inject<MatDialogRef<ExpenseAddDialogComponent>>(MatDialogRef)

  errors = ''
  isSubmitting = false

  myExpense: ExpenseAdd | undefined

  ngOnInit() {
    this.myExpense = {
      budgetId: this.financeService.budget?.id ?? '',
      description: '',
      amount: 0,
      isForever: true,
      frequency: '',
      startDate: this.financeService.getFirstDate(),
      endDate: null,
      repeatMon: false,
      repeatTue: false,
      repeatWed: false,
      repeatThu: false,
      repeatFri: false,
      repeatSat: false,
      repeatSun: false,
    }
  }

  create(form: NgForm) {
    const { value, valid } = form
    if (valid) {
      this.isSubmitting = true
      this.errors = ''
      value.budgetId = this.financeService.budget?.id
      this.dalExpenseService.add(value).subscribe({
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
  selector: 'app-expense-add',
  template: '',
  standalone: true,
})
export class ExpenseAddComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private financeService = inject(FinanceService)

  matDialogRef: MatDialogRef<ExpenseAddDialogComponent> | null = null

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ExpenseAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.budget?.id])
      })
    })
  }
}
