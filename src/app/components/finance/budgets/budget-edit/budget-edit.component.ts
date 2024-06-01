import { CdkScrollable } from '@angular/cdk/scrolling'
import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
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
import { BudgetDeleteComponent } from '@components/finance/budgets/budget-delete/budget-delete.component'
import { SpinnerComponent } from '@components/ui/spinner/spinner.component'
import { BudgetEdit } from '@interfaces/budgets/budget-edit.interface'
import { Budget } from '@interfaces/budgets/budget.interface'
import { DalBudgetService } from '@services/dal/dal.budget.service'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-edit',
  template: '',
  standalone: true,
})
export class BudgetEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetEditDialogComponent> | null = null

  constructor(public matDialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetEditDialogComponent)
    })
  }
}

@Component({
  selector: 'app-budget-edit-dialog',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss'],
  standalone: true,
  imports: [
    CdkScrollable,
    FormsModule,
    MatButton,
    MatCheckbox,
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
export class BudgetEditDialogComponent implements OnInit {
  errors: string = ''
  isRequesting: boolean = false
  submitted = false

  oldBudget: Budget | undefined
  newBudget: BudgetEdit | undefined

  navigateToDelete = false
  deleteModal: MatDialogRef<BudgetDeleteComponent> | null = null

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetEditDialogComponent> | null,
  ) {}

  ngOnInit() {
    this.setAfterClosed()
    this.oldBudget = this.financeService.selectedBudget
    if (this.oldBudget) {
      this.newBudget = {
        id: this.oldBudget.id,
        name: this.oldBudget.name,
        isActive: this.oldBudget.isActive,
      }
    }
  }

  setAfterClosed() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      // need to check for navigation with forward button
      const action =
        this.router.url.split('/')[this.router.url.split('/').length - 1]
      if (action !== 'delete') {
        if (!this.navigateToDelete) {
          this.router.navigate(['/', this.financeService.selectedBudget?.id])
        } else {
          this.router.navigate([
            '/',
            this.financeService.selectedBudget?.id,
            'delete',
          ])
        }
      }
    })
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  edit(form: NgForm) {
    const { value, valid } = form
    this.submitted = true
    this.isRequesting = true
    this.errors = ''

    if (valid && this.oldBudget) {
      value.id = this.oldBudget.id
      // TODO:
      this.dalBudgetService.update(this.oldBudget, value).subscribe(
        () => {
          this.matDialogRef?.close()
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
