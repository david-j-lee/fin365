import { CdkScrollable } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { Rule } from '@interfaces/rule.interface'
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
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<BalanceDeleteDialogComponent>>(MatDialogRef)
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false
  deleteBalance: Rule | undefined

  ngOnInit() {
    this.deleteBalance = this.financeService.budget?.balances?.find(
      (balance) => balance.id === this.data.id,
    )
  }

  async delete() {
    if (!this.deleteBalance) {
      return
    }
    this.isSubmitting = true
    this.errors = ''
    try {
      await this.financeService.deleteRule(this.deleteBalance)
      this.matDialogRef.close()
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
  selector: 'app-balance-delete',
  template: '',
  standalone: true,
})
export class BalanceDeleteComponent implements AfterViewInit {
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent> | null = null

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.matDialogRef = this.matDialog.open(BalanceDeleteDialogComponent, {
        data: { id: params['id'] },
      })
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', params['budgetId']])
      })
    })
  }
}
