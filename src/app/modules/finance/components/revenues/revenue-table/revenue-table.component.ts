import { Component } from '@angular/core';

import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-revenue-table',
  templateUrl: 'revenue-table.component.html',
  styleUrls: ['revenue-table.component.scss'],
})
export class RevenueTableComponent {
  constructor(public financeService: FinanceService) {}
}
