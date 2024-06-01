// TODO:

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { Revenue } from '@interfaces/revenues/revenue.interface'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { FinanceService } from '@services/finance.service'

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
  ) {}

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
              // need to check action for navigation with back button
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
  isRequesting: boolean = false
  submitted = false

  deleteRevenue: Revenue | undefined

  constructor(
    private financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget?.revenues) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalRevenueService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result: any) => {
          if (result) {
            this.getData()
          }
        })
    }
  }

  getData() {
    // Get Balance
    const revenue = this.financeService.selectedBudget?.revenues?.find(
      (x) => x.id == this.data.id,
    )
    this.deleteRevenue = revenue
  }

  delete() {
    if (this.deleteRevenue) {
      this.dalRevenueService.delete(this.deleteRevenue.id).subscribe(
        () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
        },
        (errors: any) => {
          this.errors = errors
        },
      )
    }
  }
}
