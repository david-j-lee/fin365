import { CdkScrollable } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { RuleAdd } from '@interfaces/rule-add.interface'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-balance-add-dialog',
  templateUrl: 'balance-add.component.html',
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
    SpinnerComponent,
  ],
})
export class BalanceAddDialogComponent implements OnInit {
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef = inject<MatDialogRef<BalanceAddDialogComponent> | null>(
    MatDialogRef,
  )

  errors = ''
  isSubmitting = false
  myBalance: RuleAdd | undefined

  constructor() {
    const budgetId = this.financeService.budget?.id

    if (budgetId) {
      this.myBalance = {
        type: 'balance',
        budgetId,
        description: '',
        amount: 0,
      }
    } else {
      this.errors = 'Unable to locate budget'
    }
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      this.router.navigate(['/', this.financeService.budget?.id], {
        preserveFragment: true,
      })
    })
  }

  async create(form: NgForm) {
    const { value, valid } = form

    if (!valid) {
      this.errors = 'Form is invalid'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.addRule({
        ...this.myBalance,
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
  selector: 'app-balance-add',
  template: '',
  standalone: true,
})
export class BalanceAddComponent implements AfterViewInit {
  private matDialog = inject(MatDialog)

  ngAfterViewInit() {
    this.matDialog.open(BalanceAddDialogComponent)
  }
}
