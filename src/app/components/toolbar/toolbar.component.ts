import { NgClass } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { MatToolbar } from '@angular/material/toolbar'
import { RouterLink } from '@angular/router'
import { ThemePickerComponent } from '@components/theme-picker/theme-picker.component'
import { FilterPipe } from '@pipes/filter.pipe'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  imports: [
    MatToolbar,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    NgClass,
    SortByPipe,
    ThemePickerComponent,
    FilterPipe,
  ],
})
export class ToolbarComponent {
  matDialog = inject(MatDialog)
  financeService = inject(FinanceService)

  showArchivedBudgets = false
}
