import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgFor, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
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
import { Router } from '@angular/router'
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { RevenueAdd } from '@interfaces/revenues/revenue-add.interface'
import { DalRevenueService } from '@services/dal/dal.revenue.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-revenue-add',
  template: '',
  standalone: true,
})
export class RevenueAddComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueAddDialogComponent> | null = null

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(RevenueAddDialogComponent)
      this.matDialogRef.afterClosed().subscribe(() => {
        this.matDialogRef = null
        this.router.navigate(['/', this.financeService.selectedBudget?.id])
      })
    })
  }
}

@Component({
  selector: 'app-revenue-add-dialog',
  templateUrl: 'revenue-add.component.html',
  styleUrls: ['revenue-add.component.scss'],
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
export class RevenueAddDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  myRevenue: RevenueAdd | undefined

  constructor(
    public financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueAddDialogComponent>,
  ) {}

  ngOnInit() {
    this.myRevenue = {
      budgetId: undefined,
      description: '',
      amount: 0,
      isForever: true,
      frequency: '',
      startDate: this.financeService.getFirstDate(),
      endDate: undefined,
      repeatMon: false,
      repeatTue: false,
      repeatWed: false,
      repeatThu: false,
      repeatFri: false,
      repeatSat: false,
      repeatSun: false,
    }
  }

  create(form: NgForm) {
    const { value, valid } = form

    this.submitted = true
    this.isRequesting = true
    this.errors = ''
    if (valid) {
      // TODO:
      this.dalRevenueService.add(value).subscribe(
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
