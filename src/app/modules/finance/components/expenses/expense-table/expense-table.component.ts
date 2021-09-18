import { Component } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-expense-table',
  templateUrl: 'expense-table.component.html',
  styleUrls: ['expense-table.component.scss'],
})
export class ExpenseTableComponent {
  constructor(public financeService: FinanceService) {}
}
