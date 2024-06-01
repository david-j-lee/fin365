// TODO:

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
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
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { Expense } from '@interfaces/expenses/expense.interface'
import { DalExpenseService } from '@services/dal/dal.expense.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-add',
  template: '',
  standalone: true,
})
export class ExpenseDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

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
            // need to check action for navigation with back button
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

@Component({
  selector: 'app-expense-delete-dialog',
  templateUrl: 'expense-delete.component.html',
  styleUrls: ['expense-delete.component.scss'],
  standalone: true,
  imports: [
    CdkScrollable,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    NgIf,
    SpinnerComponent,
  ],
})
export class ExpenseDeleteDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  deleteExpense: Expense | undefined

  constructor(
    private financeService: FinanceService,
    private dalExpenseService: DalExpenseService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget?.expenses) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalExpenseService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe(() => {
          this.getData()
        })
    }
  }

  getData() {
    // Get Balance
    const expense = this.financeService.selectedBudget?.expenses?.find(
      (x) => x.id == this.data.id,
    )
    this.deleteExpense = expense
  }

  delete() {
    if (this.deleteExpense) {
      this.dalExpenseService.delete(this.deleteExpense.id).subscribe(
        () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
        },
        (errors: any) => {
          this.errors = errors
        },
      )
    }
  }
}
