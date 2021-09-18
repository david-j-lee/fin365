import { Component } from '@angular/core';

import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-budget-listing',
  templateUrl: './budget-listing.component.html',
  styleUrls: ['./budget-listing.component.scss'],
})
export class BudgetListingComponent {
  constructor(public financeService: FinanceService) {}
}
