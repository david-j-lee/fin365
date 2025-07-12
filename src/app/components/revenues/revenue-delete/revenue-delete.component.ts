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
import { RuleRepeatable } from '@interfaces/rule-repeatable.interface'
import { FinanceService } from '@services/finance.service'

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
  private financeService = inject(FinanceService)
  matDialog = inject(MatDialog)
  private matSnackBar = inject(MatSnackBar)
  matDialogRef =
    inject<MatDialogRef<RevenueDeleteDialogComponent>>(MatDialogRef)
  data = inject<{
    id: string
  }>(MAT_DIALOG_DATA)

  errors = ''
  isSubmitting = false

  deleteRevenue: RuleRepeatable | undefined

  ngOnInit() {
    this.deleteRevenue = this.financeService.budget?.revenues?.find(
      (budgetRevenue) => budgetRevenue.id === this.data.id,
    )
  }

  async delete() {
    if (!this.deleteRevenue) {
      return
    }
    this.isSubmitting = true
    try {
      await this.financeService.deleteRule(this.deleteRevenue)
      this.matDialogRef.close()
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
export class RevenueDeleteComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  matDialogRef: MatDialogRef<RevenueDeleteDialogComponent> | null = null

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
