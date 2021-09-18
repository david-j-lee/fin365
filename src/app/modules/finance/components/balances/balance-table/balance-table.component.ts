import { Component } from '@angular/core';

import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  styleUrls: ['balance-table.component.scss'],
})
export class BalanceTableComponent {
  constructor(public financeService: FinanceService) {}
}
