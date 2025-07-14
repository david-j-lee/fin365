import { CdkScrollable } from '@angular/cdk/scrolling'
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
} from '@angular/core'
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
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { FinanceService } from '@services/finance.service'
import { Subscription } from 'rxjs'

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
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<ExpenseEditDialogComponent> | null>(
      MatDialogRef<ExpenseEditDialogComponent>,
    )
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldExpense: RuleRepeatable | undefined
  newExpense: RuleRepeatableAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<ExpenseDeleteComponent> | null = null

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isExpensesLoaded()) {
        return
      }

      this.oldExpense = this.financeService.budget
        ?.expenses()
        ?.find((budgetExpense) => budgetExpense.id === this.data.id)

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
      } else {
        this.errors = 'Unable to locate expense'
      }
    })
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
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
    })
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  async edit(form: NgForm) {
    const { value, valid } = form

    if (!valid || !this.oldExpense) {
      this.errors = 'Form is invalid'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.editRule(this.oldExpense, {
        ...this.newExpense,
        ...value,
      })
      this.matDialogRef?.close()
      this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
    } catch (error) {
      this.errors = error as string
    } finally {
      this.isSubmitting = false
    }
  }
}

@Component({
  selector: 'app-expense-edit',
  template: '',
  standalone: true,
})
export class ExpenseEditComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(ExpenseEditDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
