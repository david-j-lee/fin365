import { CdkScrollable } from '@angular/cdk/scrolling'
import { Component, OnInit, inject } from '@angular/core'
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
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { FinanceService } from '@services/finance.service'

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
  private dalRevenueService = inject(DalRevenueService)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef = inject<MatDialogRef<RevenueEditDialogComponent> | null>(
    MatDialogRef<RevenueEditDialogComponent>,
  )
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  oldRevenue: Revenue | undefined
  newRevenue: RevenueAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<RevenueDeleteComponent> | null = null

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
    if (this.financeService.budget?.revenues) {
      this.getData()
    } else if (this.financeService.budget) {
      this.dalRevenueService
        .getAll(this.financeService.budget.id)
        .subscribe((result) => {
          if (result) {
            this.getData()
          }
        })
    }
  }

  setAfterClosed() {
    if (this.matDialogRef) {
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        // Need to check for navigation with forward button
        const action =
          this.router.url.split('/')[this.router.url.split('/').length - 1]

        if (action === 'delete') {
          return
        }

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
  }

  getData() {
    // Get Revenue
    const revenue = this.financeService.budget?.revenues?.find(
      (budgetRevenue) => budgetRevenue.id === this.data.id,
    )
    if (!revenue) {
      return
    }
    this.oldRevenue = revenue
    this.newRevenue = {
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
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  edit(form: NgForm) {
    const { value, valid } = form
    if (valid && this.oldRevenue) {
      this.isSubmitting = true
      this.errors = ''
      this.dalRevenueService.update(this.oldRevenue, value).subscribe({
        next: () => {
          this.matDialogRef?.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
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
  selector: 'app-revenue-edit',
  template: '',
  standalone: true,
})
export class RevenueEditComponent implements OnInit {
  matDialog = inject(MatDialog)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<RevenueEditDialogComponent> | null = null

  ngOnInit() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(() => {
        this.activatedRoute.params.subscribe((params) => {
          setTimeout(() => {
            this.matDialogRef = this.matDialog.open(
              RevenueEditDialogComponent,
              {
                data: { id: params['id'] },
              },
            )
          })
        })
      })
    }
  }
}
