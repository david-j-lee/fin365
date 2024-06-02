import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgFor, NgIf } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
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
  styleUrls: ['revenue-edit.component.scss'],
  standalone: true,
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
    NgFor,
    NgIf,
    SpinnerComponent,
  ],
})
export class RevenueEditDialogComponent implements OnInit {
  errors: string = ''
  isSubmitting: boolean = false

  oldRevenue: Revenue | undefined
  newRevenue: RevenueAdd | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<RevenueDeleteComponent> | null = null

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private dalRevenueService: DalRevenueService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueEditDialogComponent> | null,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {
    // Inject services
  }

  ngOnInit() {
    this.setAfterClosed()
    // Get Balance
    if (this.financeService.selectedBudget?.revenues) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalRevenueService
        .getAll(this.financeService.selectedBudget.id)
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
            this.financeService.selectedBudget?.id,
            'revenue',
            this.oldRevenue?.id,
            'delete',
          ])
        } else {
          this.router.navigate(['/', this.financeService.selectedBudget?.id])
        }
      })
    }
  }

  getData() {
    // Get Revenue
    const revenue = this.financeService.selectedBudget?.revenues?.find(
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
  matDialogRef: MatDialogRef<RevenueEditDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    // Inject services
  }

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
