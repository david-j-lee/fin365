import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgFor, NgIf } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
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
import { ExpenseDeleteComponent } from '@components/finance/expenses/expense-delete/expense-delete.component'
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { ExpenseAdd } from '@interfaces/expenses/expense-add.interface'
import { Expense } from '@interfaces/expenses/expense.interface'
import { DalExpenseService } from '@services/dal/dal.expense.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-expense-edit',
  template: '',
  standalone: true,
})
export class ExpenseEditComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseEditDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {}

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

@Component({
  selector: 'app-expense-edit-dialog',
  templateUrl: 'expense-edit.component.html',
  styleUrls: ['expense-edit.component.scss'],
  standalone: true,
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
    NgFor,
    NgIf,
    SpinnerComponent,
  ],
})
export class ExpenseEditDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  oldExpense: Expense | undefined
  newExpense: ExpenseAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<ExpenseDeleteComponent> | null = null

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private dalExpenseService: DalExpenseService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseEditDialogComponent> | null,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {}

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
    if (this.financeService.selectedBudget?.expenses) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalExpenseService
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
      // need to check for navigation with forward button
      const action =
        this.router.url.split('/')[this.router.url.split('/').length - 1]
      if (action !== 'delete') {
        if (!this.navigateToDelete) {
          this.router.navigate(['/', this.financeService.selectedBudget?.id])
        } else {
          this.router.navigate([
            './',
            this.financeService.selectedBudget?.id,
            'expense',
            this.oldExpense?.id,
            'delete',
          ])
        }
      }
    })
  }

  getData() {
    // Get Balance
    const expense = this.financeService.selectedBudget?.expenses?.find(
      (x) => x.id == this.data.id,
    )
    this.oldExpense = expense
    if (this.oldExpense) {
      this.newExpense = {
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

    this.submitted = true
    this.isRequesting = true
    this.errors = ''

    if (valid && this.oldExpense) {
      this.dalExpenseService.update(this.oldExpense, value).subscribe({
        next: () => {
          this.matDialogRef?.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
        },
        error: (errors) => {
          this.errors = errors
        },
        complete: () => {
          this.isRequesting = false
        },
      })
    }
  }
}
