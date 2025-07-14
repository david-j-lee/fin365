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
import { RevenueDeleteComponent } from '@components/revenues/revenue-delete/revenue-delete.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { RuleRepeatableAdd } from '@interfaces/rule-repeatable-add.interface'
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { FinanceService } from '@services/finance.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-revenue-edit-dialog',
  templateUrl: 'revenue-edit.component.html',
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
export class RevenueEditDialogComponent implements OnInit {
  financeService = inject(FinanceService)
  private router = inject(Router)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef =
    inject<MatDialogRef<RevenueEditDialogComponent> | null>(
      MatDialogRef<RevenueEditDialogComponent>,
    )
  private data = inject<{ id: string }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldRevenue: RuleRepeatable | undefined
  newRevenue: RuleRepeatableAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<RevenueDeleteComponent> | null = null

  constructor() {
    effect(() => {
      if (!this.financeService.budget?.isRevenuesLoaded()) {
        return
      }

      this.oldRevenue = this.financeService.budget
        ?.revenues()
        ?.find((budgetRevenue) => budgetRevenue.id === this.data.id)

      if (this.oldRevenue) {
        this.newRevenue = {
          type: 'revenue',
          budgetId: this.oldRevenue.budgetId,
          description: this.oldRevenue.description,
          amount: this.oldRevenue.amount,
          isForever: this.oldRevenue.isForever,
          frequency: this.oldRevenue.frequency,
          startDate: this.oldRevenue.startDate,
          endDate: this.oldRevenue.endDate,
          repeatMon: this.oldRevenue.repeatMon,
          repeatTue: this.oldRevenue.repeatTue,
          repeatWed: this.oldRevenue.repeatWed,
          repeatThu: this.oldRevenue.repeatThu,
          repeatFri: this.oldRevenue.repeatFri,
          repeatSat: this.oldRevenue.repeatSat,
          repeatSun: this.oldRevenue.repeatSun,
        }
      } else {
        this.errors = 'Unable to locate revenue'
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
          'revenue',
          this.oldRevenue?.id,
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

    if (!valid || !this.oldRevenue) {
      this.errors = 'Unable to locate revenue'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.editRule(this.oldRevenue, {
        ...this.newRevenue,
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
  selector: 'app-revenue-edit',
  template: '',
  standalone: true,
})
export class RevenueEditComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private matDialog = inject(MatDialog)

  private routeParamsSubscription: Subscription | null = null

  ngAfterViewInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.matDialog.open(RevenueEditDialogComponent, {
        data: { id: params['id'] },
      })
    })
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe()
  }
}
