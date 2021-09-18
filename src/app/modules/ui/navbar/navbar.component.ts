import { Component, OnInit } from '@angular/core';

import { NavbarService } from '../../ui/navbar/navbar.service';
import { FinanceService } from '../../finance/services/finance.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    showArchivedBudgets = false;
    showArchivedClasses = false;

    constructor(
        public navbarService: NavbarService,
        public financeService: FinanceService,
    ) {
    }

    ngOnInit() {
    }

    toggleArchivedBudgets() {
        this.showArchivedBudgets = !this.showArchivedBudgets;
    }

    toggleArchivedClasses() {
        this.showArchivedClasses = !this.showArchivedClasses;
    }
}
