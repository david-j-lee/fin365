import { Component, OnInit, inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
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
    MatButton,
    MatCard,
    RouterLink,
    MatCardHeader,
    MatCardTitle,
    RouterOutlet,
    SortByPipe,
    FilterPipe,
  ],
})
export class BudgetListingComponent implements OnInit {
  financeService = inject(FinanceService)

  ngOnInit() {
    this.financeService.selectBudget(null)
  }
}
