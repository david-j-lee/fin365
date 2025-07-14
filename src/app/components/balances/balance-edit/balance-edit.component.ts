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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatError, MatFormField, MatHint } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { BalanceDeleteComponent } from '@components/balances/balance-delete/balance-delete.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { RuleEdit } from '@interfaces/rule-edit.interface'
import { Rule } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-balance-edit-dialog',
  templateUrl: 'balance-edit.component.html',
  imports: [
    FormsModule,
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatHint,
    MatError,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    SpinnerComponent,
  ],
})
export class BalanceEditDialogComponent implements OnInit {
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<BalanceEditDialogComponent> | null>(
      MatDialogRef<BalanceEditDialogComponent>,
    )
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldBalance: Rule | undefined
  newBalance: RuleEdit | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<BalanceDeleteComponent> | null = null

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isBalancesLoaded()) return

      this.oldBalance = this.financeService.budget
        ?.balances()
        .find((balance) => balance.id === this.data.id)

      if (this.oldBalance) {
        this.newBalance = {
          type: 'balance',
          id: this.oldBalance.id,
          description: this.oldBalance.description,
          amount: this.oldBalance.amount,
        }
      } else {
        this.errors = 'Unable to locate balance'
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
          'balance',
          this.oldBalance?.id,
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
    if (!valid || !this.oldBalance) {
      return
    }
    this.isSubmitting = true
    this.errors = ''
    try {
      await this.financeService.editRule(this.oldBalance, {
        ...this.newBalance,
        ...value,
      })
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
  selector: 'app-balance-edit',
  template: '',
  standalone: true,
})
export class BalanceEditComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(BalanceEditDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
