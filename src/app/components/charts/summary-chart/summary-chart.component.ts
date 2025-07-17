import { Component, Input, OnInit, inject } from '@angular/core'
import { barOptions } from '@constants/chart.constants'
import { RuleType } from '@interfaces/rule.interface'
import { SummaryChart } from '@interfaces/summary-chart.interface'
import { FinanceService } from '@services/finance.service'
import {
  getRgbaForRule,
  getRulesSignalFromBudget,
} from '@utilities/rule.utilities'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-summary-chart',
  templateUrl: 'summary-chart.component.html',
  imports: [BaseChartDirective],
})
export class SummaryChartComponent implements OnInit {
  private financeService = inject(FinanceService)

  @Input() ruleType: RuleType | null = null

  chart: SummaryChart = {
    chartType: 'bar',
    options: barOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    },
  }

  ngOnInit() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === this.ruleType) {
        this.setChart()
      }
    })
  }

  private setChart() {
    if (!this.financeService.budget || !this.ruleType) {
      return
    }

    const records = getRulesSignalFromBudget(
      this.financeService.budget,
      this.ruleType,
    )
    const count = records().length
    const data: number[] = []
    const labels: string[] = []
    const backgroundColors: string[] = []

    records()
      .toSorted((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((rule, index) => {
        data.push(rule.yearlyAmount)
        labels.push(rule.description)
        backgroundColors.push(getRgbaForRule(this.ruleType, count, index))
      })

    this.chart.data = {
      ...this.chart.data,
      labels,
      datasets: [
        {
          ...this.chart.data.datasets[0],
          backgroundColor: backgroundColors,
          data,
        },
      ],
    }
  }
}
