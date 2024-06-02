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
import { Balance } from '@interfaces/balances/balance.interface'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-delete',
  template: '',
  standalone: true,
})
export class BalanceDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((parentParams) => {
      this.activatedRoute.params.subscribe((params) => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            BalanceDeleteDialogComponent,
            { data: { id: params['id'] } },
          )
          this.matDialogRef.afterClosed().subscribe(() => {
            this.matDialogRef = null
            // need to check action for navigation with back button
            const action =
              this.router.url.split('/')[this.router.url.split('/').length - 1]
            if (action !== 'edit') {
              this.router.navigate(['/', parentParams['budgetId']])
            }
          })
        })
      })
    })
  }
}

@Component({
  selector: 'app-balance-delete-dialog',
  templateUrl: 'balance-delete.component.html',
  styleUrls: ['balance-delete.component.scss'],
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
export class BalanceDeleteDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  deleteBalance: Balance | undefined

  constructor(
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget?.balances) {
      this.getData()
    } else if (this.financeService.selectedBudget) {
      this.dalBalanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe((result) => {
          if (result) {
            this.getData()
          }
        })
    }
  }

  getData() {
    const balance = this.financeService.selectedBudget?.balances?.find(
      (x) => x.id == this.data.id,
    )
    this.deleteBalance = balance
  }

  delete() {
    if (this.deleteBalance) {
      this.dalBalanceService.delete(this.deleteBalance.id).subscribe({
        next: () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 })
        },
        error: (errors) => {
          this.errors = errors
        },
      })
    }
  }
}
