import { Component, OnInit } from '@angular/core';

import { FinanceService } from '../../services/finance.service';
import { DailyService } from '../../services/daily.service';
import { SideBarService } from '../../services/side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  startDate: string;

  constructor(
    public financeService: FinanceService,
    public dailyService: DailyService,
    public sideBarService: SideBarService
  ) {
    this.startDate = financeService.selectedBudget?.startDate.toString() ?? '';
  }

  ngOnInit() {}
}
