import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
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
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-revenue-delete-dialog',
  templateUrl: 'revenue-delete.component.html',
  styleUrls: ['revenue-delete.component.scss'],
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
export class RevenueDeleteDialogComponent implements OnInit {
  errors: string = ''
  isSubmitting: boolean = false

  deleteRevenue: Revenue | undefined

  constructor(
    private financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {
    // Inject
  }

  ngOnInit() {
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

  getData() {
    // Get Balance
    const revenue = this.financeService.selectedBudget?.revenues?.find(
      (budgetRevenue) => budgetRevenue.id === this.data.id,
    )
    this.deleteRevenue = revenue
  }

  delete() {
    if (this.deleteRevenue) {
      this.isSubmitting = true
      this.dalRevenueService.delete(this.deleteRevenue.id).subscribe({
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
  selector: 'app-revenue-delete',
  template: '',
  standalone: true,
})
export class RevenueDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueDeleteDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Inject
  }

  ngOnInit() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe((parentParams) => {
        this.activatedRoute.params.subscribe((params) => {
          setTimeout(() => {
            this.matDialogRef = this.matDialog.open(
              RevenueDeleteDialogComponent,
              { data: { id: params['id'] } },
            )
            this.matDialogRef.afterClosed().subscribe(() => {
              this.matDialogRef = null
              // Need to check action for navigation with back button
              const action =
                this.router.url.split('/')[
                  this.router.url.split('/').length - 1
                ]
              if (action !== 'edit') {
                this.router.navigate(['/', parentParams['budgetId']])
              }
            })
          })
        })
      })
    }
  }
}
