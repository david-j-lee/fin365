import { CdkScrollable } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, OnInit, inject } from '@angular/core'
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
import { BudgetDeleteComponent } from '@components/budgets/budget-delete/budget-delete.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { BudgetEdit } from '@interfaces/budget-edit.interface'
import { Budget } from '@interfaces/budget.interface'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-edit-dialog',
  templateUrl: './budget-edit.component.html',
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
    SpinnerComponent,
  ],
})
export class BudgetEditDialogComponent implements OnInit {
  private router = inject(Router)
  private financeService = inject(FinanceService)
  private matSnackBar = inject(MatSnackBar)
  private matDialogRef = inject<MatDialogRef<BudgetEditDialogComponent> | null>(
    MatDialogRef<BudgetEditDialogComponent>,
  )

  errors = ''
  isSubmitting = false

  oldBudget: Budget | null = null
  newBudget: BudgetEdit | null = null

  navigateToDelete = false
  deleteModal: MatDialogRef<BudgetDeleteComponent> | null = null

  constructor() {
    this.oldBudget = this.financeService.budget
    if (this.oldBudget) {
      this.newBudget = {
        id: this.oldBudget.id,
        name: this.oldBudget.name,
        isActive: this.oldBudget.isActive,
      }
    } else {
      this.errors = 'Unable to locate budget'
    }
  }

  ngOnInit() {
    this.matDialogRef?.afterClosed().subscribe(() => {
      this.matDialogRef = null
      if (this.navigateToDelete) {
        this.router.navigate(['/', this.financeService.budget?.id, 'delete'], {
          preserveFragment: true,
        })
      } else {
        this.router.navigate(['/', this.financeService.budget?.id], {
          preserveFragment: true,
        })
      }
    })
  }

  requestDelete() {
    this.navigateToDelete = true
    this.matDialogRef?.close()
  }

  async edit(form: NgForm) {
    const { value, valid } = form

    if (!valid || !this.oldBudget) {
      this.errors = 'Form is invalid'
      return
    }

    this.isSubmitting = true
    this.errors = ''

    try {
      await this.financeService.editBudget(this.oldBudget, {
        ...this.newBudget,
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
  selector: 'app-budget-edit',
  template: '',
  standalone: true,
})
export class BudgetEditComponent implements AfterViewInit {
  private matDialog = inject(MatDialog)

  ngAfterViewInit() {
    this.matDialog.open(BudgetEditDialogComponent)
  }
}
