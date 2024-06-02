import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { Budget } from '@interfaces/budgets/budget.interface'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-delete',
  template: '',
  standalone: true,
})
export class BudgetDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetDeleteDialogComponent> | null = null

  constructor(public matDialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetDeleteDialogComponent)
    })
  }
}

@Component({
  selector: 'app-budget-delete-dialog',
  templateUrl: 'budget-delete.component.html',
  styleUrls: ['./budget-delete.component.scss'],
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
export class BudgetDeleteDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  deleteBudget: Budget | undefined

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    public matDialog: MatDialog,
    public matDialogRef: MatDialogRef<BudgetDeleteDialogComponent> | null,
  ) {}

  ngOnInit() {
    this.setAfterClose()
    this.deleteBudget = this.financeService.selectedBudget
  }

  setAfterClose() {
    if (this.matDialogRef) {
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        // need to check action for navigation with back button
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
          this.router.navigate(['/', this.financeService.budgets[0].id])
        } else if (action !== 'edit') {
          this.router.navigate(['/', this.financeService.selectedBudget?.id])
        }
      })
    }
  }

  delete() {
    if (this.deleteBudget) {
      this.dalBudgetService.delete(this.deleteBudget.id).subscribe({
        next: () => {
          this.matDialogRef?.close()
        },
        error: (errors) => {
          this.errors = errors
        },
      })
    }
  }
}
