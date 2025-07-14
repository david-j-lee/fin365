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
  selector: 'app-revenue-delete-dialog',
  templateUrl: 'revenue-delete.component.html',
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
export class RevenueDeleteDialogComponent implements OnInit {
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<RevenueDeleteDialogComponent> | null>(MatDialogRef)
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false
  deleteRevenue: RuleRepeatable | undefined

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isRevenuesLoaded()) return

      this.deleteRevenue = this.financeService.budget
        ?.revenues()
        ?.find((budgetRevenue) => budgetRevenue.id === this.data.id)

      if (!this.deleteRevenue) {
        this.errors = 'Unable to locate revenue'
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
    if (!this.deleteRevenue) {
      this.errors = 'Unable to locate revenue'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.deleteRule(this.deleteRevenue)
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
  selector: 'app-revenue-delete',
  template: '',
  standalone: true,
})
export class RevenueDeleteComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(RevenueDeleteDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
