import { CdkScrollable } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { Budget } from '@interfaces/budget.interface'
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
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<BudgetDeleteDialogComponent> | null>(
      MatDialogRef<BudgetDeleteDialogComponent>,
    )

  errors = ''
  isSubmitting = false
  deleteBudget: Budget | null = null

  constructor() {
    this.deleteBudget = this.financeService.budget
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
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
        this.router.navigate(['/', this.financeService.budgets[0].id], {
          preserveFragment: true,
        })
      } else if (action !== 'edit') {
        this.router.navigate(['/', this.financeService.budget?.id], {
          preserveFragment: true,
        })
      }
    })
  }

  async delete() {
    if (!this.deleteBudget) {
      this.errors = 'Unable to locate budget'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.deleteBudget(this.deleteBudget)
      this.matDialogRef?.close()
      this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
    } catch (error) {
      this.errors = error as string
      console.error(error)
    } finally {
      this.isSubmitting = false
    }
  }
}

@Component({
  selector: 'app-budget-delete',
  template: '',
  standalone: true,
})
export class BudgetDeleteComponent implements AfterViewInit {
  private matDialog = inject(MatDialog)

  ngAfterViewInit() {
    this.matDialog.open(BudgetDeleteDialogComponent)
  }
}
