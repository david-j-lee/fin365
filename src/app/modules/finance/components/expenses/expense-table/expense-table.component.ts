import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-expense-table',
  templateUrl: 'expense-table.component.html',
  styleUrls: ['expense-table.component.scss'],
})
export class ExpenseTableComponent implements OnInit {
  constructor(public financeService: FinanceService) {}

  ngOnInit() {}
}
