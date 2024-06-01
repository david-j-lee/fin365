import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import {
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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { BalanceAdd } from '@interfaces/balances/balance-add.interface'
import { DalBalanceService } from '@services/dal/dal.balance.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-add',
  template: '',
  standalone: true,
})
export class BalanceAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceAddDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BalanceAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      })
    })
  }
}

@Component({
  selector: 'app-balance-add-dialog',
  templateUrl: 'balance-add.component.html',
  styleUrls: ['balance-add.component.scss'],
  standalone: true,
  imports: [
    CdkScrollable,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    NgIf,
    SpinnerComponent,
  ],
})
export class BalanceAddDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  myBalance: BalanceAdd | undefined

  constructor(
    public financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceAddDialogComponent>,
  ) {}

  ngOnInit() {
    this.myBalance = {
      budgetId: undefined,
      description: '',
      amount: 0,
    }
  }

  create(form: NgForm) {
    const { value, valid } = form

    this.submitted = true
    this.isRequesting = true
    this.errors = ''
    if (valid && this.financeService.selectedBudget) {
      value.budgetId = this.financeService.selectedBudget.id
      this.dalBalanceService.add(value).subscribe(
        () => {
          this.matDialogRef.close()
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
        },
        (errors: any) => {
          this.errors = errors
        },
        () => {
          this.isRequesting = false
        },
      )
    }
  }
}
