import { Component, OnInit } from '@angular/core';

import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  styleUrls: ['balance-table.component.scss'],
})
export class BalanceTableComponent implements OnInit {
  constructor(public financeService: FinanceService) {}

  ngOnInit() {}
}
