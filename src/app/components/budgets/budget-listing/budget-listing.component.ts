import { Component, inject } from '@angular/core'
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card'
import { RouterLink, RouterOutlet } from '@angular/router'
import { FilterPipe } from '@pipes/filter.pipe'
import { SortByPipe } from '@pipes/sort.pipe'
import { FinanceService } from '@services/finance.service'

@Component({
  selector: 'app-budget-listing',
  templateUrl: './budget-listing.component.html',
  styleUrls: ['./budget-listing.component.scss'],
  imports: [
    MatCard,
    RouterLink,
    MatCardHeader,
    MatCardTitle,
    RouterOutlet,
    SortByPipe,
    FilterPipe,
  ],
})
export class BudgetListingComponent {
  financeService = inject(FinanceService)
}
