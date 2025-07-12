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
import { Rule } from '@interfaces/rules/rule.interface'
import { DalRuleService } from '@services/dal/dal.rule.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-delete-dialog',
  templateUrl: 'balance-delete.component.html',
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
export class BalanceDeleteDialogComponent implements OnInit {
  private financeService = inject(FinanceService)
  private dalBalanceService = inject(DalRuleService)
  matDialog = inject(MatDialog)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef =
    inject<MatDialogRef<BalanceDeleteDialogComponent>>(MatDialogRef)
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  deleteBalance: Rule | undefined

  ngOnInit() {
    if (this.financeService.budget?.balances) {
      this.getData()
    } else if (this.financeService.budget) {
      this.dalBalanceService
        .getAll('balances', this.financeService.budget.id)
        .subscribe((result) => {
          if (result) {
            this.getData()
          }
        })
    }
  }

  getData() {
    const balanceToDelete = this.financeService.budget?.balances?.find(
      (balance) => balance.id === this.data.id,
    )
    this.deleteBalance = balanceToDelete
  }

  delete() {
    if (this.deleteBalance) {
      this.isSubmitting = true
      this.dalBalanceService
        .delete('balances', this.deleteBalance.id)
        .subscribe({
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
  selector: 'app-balance-delete',
  template: '',
  standalone: true,
})
export class BalanceDeleteComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent> | null = null

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            BalanceDeleteDialogComponent,
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
