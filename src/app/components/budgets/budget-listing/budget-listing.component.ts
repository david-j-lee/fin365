import { Component, OnInit, inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { RouterLink, RouterOutlet } from '@angular/router'
import { FilterPipe } from '@pipes/filter.pipe'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-listing',
  templateUrl: './budget-listing.component.html',
  styleUrls: ['./budget-listing.component.scss'],
  imports: [MatButton, RouterLink, RouterOutlet, SortByPipe, FilterPipe],
})
export class BudgetListingComponent implements OnInit {
  financeService = inject(FinanceService)

  ngOnInit() {
    this.financeService.selectBudget(null)
  }
}
