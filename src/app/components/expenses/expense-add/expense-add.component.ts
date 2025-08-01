import { CdkScrollable } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { frequencies } from '@constants/budget.constants'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
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
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef = inject<MatDialogRef<ExpenseAddDialogComponent> | null>(
    MatDialogRef,
  )

  errors = ''
  isSubmitting = false
  myExpense: RuleRepeatableAdd | undefined
  frequencies = frequencies

  constructor() {
    if (this.financeService.budget) {
      this.myExpense = {
        type: 'expense',
        budgetId: this.financeService.budget.id,
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
    } else {
      this.errors = 'Unable to locate budget'
    }
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      this.router.navigate(['/', this.financeService.budget?.id], {
        preserveFragment: true,
      })
    })
  }

  async create(form: NgForm) {
    const { value, valid } = form

    if (!valid) {
      this.errors = 'Form is invalid'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.addRule({ ...this.myExpense, ...value })
      this.matDialogRef?.close()
      this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
    } catch (error) {
      this.errors = error as string
      console.error(error)
    } finally {
      this.isSubmitting = false
    }
  }
}

@Component({
  selector: 'app-expense-add',
  template: '',
  standalone: true,
})
export class ExpenseAddComponent implements AfterViewInit {
  private matDialog = inject(MatDialog)

  ngAfterViewInit() {
    this.matDialog.open(ExpenseAddDialogComponent)
  }
}
