import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
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
import { BudgetAdd } from '@interfaces/budgets/budget-add.interface'
import { DalBudgetService } from '@services/dal/dal.budget.service'
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
    NgIf,
    SpinnerComponent,
  ],
  standalone: true,
})
export class BudgetAddDialogComponent implements OnInit {
  errors: string = ''
  isSubmitting: boolean = false

  myBudget: BudgetAdd | undefined

  constructor(
    public matDialogRef: MatDialogRef<BudgetAddDialogComponent>,
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
  ) {
    // Inject services
  }

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() }
  }

  create(form: NgForm) {
    const { value, valid } = form
    if (valid) {
      this.isSubmitting = true
      this.errors = ''
      this.dalBudgetService.add(value).subscribe({
        next: () => {
          this.matDialogRef.close()
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
  selector: 'app-budget-add',
  template: '',
  standalone: true,
})
export class BudgetAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetAddDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
  ) {
    // Inject services
  }

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        if (this.financeService.selectedBudget) {
          this.router.navigate(['/', this.financeService.selectedBudget.id])
        } else {
          this.router.navigate(['/'])
        }
      })
    })
  }
}
