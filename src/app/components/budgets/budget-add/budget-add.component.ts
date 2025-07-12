import { CdkScrollable } from '@angular/cdk/scrolling'
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker'
import {
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
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { BudgetAdd } from '@interfaces/budget-add.interface'
import { FinanceService } from '@services/finance.service'
import moment from 'moment'

@Component({
  selector: 'app-budget-add-dialog',
  templateUrl: 'budget-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkScrollable,
    FormsModule,
    MatButton,
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
    MatSuffix,
    SpinnerComponent,
  ],
})
export class BudgetAddDialogComponent implements OnInit {
  matDialogRef = inject<MatDialogRef<BudgetAddDialogComponent>>(MatDialogRef)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)

  errors = ''
  isSubmitting = false

  myBudget: BudgetAdd | undefined

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() }
  }

  async create(form: NgForm) {
    const { value, valid } = form
    if (!valid) {
      return
    }
    this.isSubmitting = true
    this.errors = ''
    try {
      await this.financeService.addBudget(value)
      this.matDialogRef.close()
      this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 })
    } catch (error) {
      this.errors = error as string
    } finally {
      this.isSubmitting = false
    }
  }
}

@Component({
  selector: 'app-budget-add',
  template: '',
  standalone: true,
})
export class BudgetAddComponent implements OnInit {
  matDialog = inject(MatDialog)
  private router = inject(Router)
  private financeService = inject(FinanceService)

  matDialogRef: MatDialogRef<BudgetAddDialogComponent> | null = null

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        if (this.financeService.budget) {
          this.router.navigate(['/', this.financeService.budget.id])
        } else {
          this.router.navigate(['/'])
        }
      })
    })
  }
}
