import { NgClass, NgFor, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { MatToolbar } from '@angular/material/toolbar'
import { RouterLink } from '@angular/router'
import { FilterPipe } from '@pipes/filter.pipe'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbar,
    NgIf,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    NgFor,
    MatMenuItem,
    NgClass,
    SortByPipe,
    FilterPipe,
  ],
})
export class ToolbarComponent {
  showArchivedBudgets = false

  constructor(
    public matDialog: MatDialog,
    public financeService: FinanceService,
  ) {
    // Inject the services
  }
}
