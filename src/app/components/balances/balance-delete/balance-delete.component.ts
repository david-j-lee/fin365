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
import { Rule } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { Subscription } from 'rxjs'

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
  private router = inject(Router)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<BalanceDeleteDialogComponent> | null>(MatDialogRef)
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false
  deleteBalance: Rule | undefined

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isBalancesLoaded()) return

      this.deleteBalance = this.financeService.budget
        ?.balances()
        .find((balance) => balance.id === this.data.id)

      if (!this.deleteBalance) {
        this.errors = 'Unable to locate balance'
      }
    })
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      this.router.navigate(['/', this.financeService.budget?.id])
    })
  }

  async delete() {
    if (!this.deleteBalance) {
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.deleteRule(this.deleteBalance)
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
  selector: 'app-balance-delete',
  template: '',
  standalone: true,
})
export class BalanceDeleteComponent implements AfterViewInit, OnDestroy {
  private matDialog = inject(MatDialog)
  private route = inject(ActivatedRoute)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(BalanceDeleteDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
