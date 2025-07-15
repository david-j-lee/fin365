import { CdkScrollable } from '@angular/cdk/scrolling'
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
} from '@angular/core'
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
import { Subscription } from 'rxjs'

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
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<ExpenseDeleteDialogComponent> | null>(MatDialogRef)
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false
  deleteExpense: RuleRepeatable | undefined

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isExpensesLoaded()) {
        return
      }

      this.deleteExpense = this.financeService.budget
        ?.expenses()
        ?.find((expense) => expense.id === this.data.id)

      if (!this.deleteExpense) {
        this.errors = 'Unable to locate expense'
      }
    })
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      this.router.navigate(['/', this.financeService.budget?.id], {
        preserveFragment: true,
      })
    })
  }

  async delete() {
    if (!this.deleteExpense) {
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.deleteRule(this.deleteExpense)
      this.matDialogRef?.close()
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
export class ExpenseDeleteComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(ExpenseDeleteDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
