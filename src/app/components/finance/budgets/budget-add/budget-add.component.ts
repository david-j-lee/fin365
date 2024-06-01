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
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { BudgetAdd } from '@interfaces/budgets/budget-add.interface'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'
import moment from 'moment'

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
  ) {}

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

@Component({
  selector: 'app-budget-add-dialog',
  templateUrl: 'budget-add.component.html',
  styleUrls: ['./budget-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DalBudgetService, FinanceService],
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
  isRequesting: boolean = false
  submitted = false

  myBudget: BudgetAdd | undefined

  constructor(
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetAddDialogComponent>,
  ) {}

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() }
  }

  create(form: NgForm) {
    const { value, valid } = form

    this.submitted = true
    this.isRequesting = true
    this.errors = ''
    if (valid) {
      this.dalBudgetService.add(value).subscribe(
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
