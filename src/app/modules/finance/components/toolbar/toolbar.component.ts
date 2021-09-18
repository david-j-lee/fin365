import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
})
export class ToolbarComponent {
  showArchivedBudgets = false;

  constructor(
    public matDialog: MatDialog,
    public financeService: FinanceService
  ) {}
}
