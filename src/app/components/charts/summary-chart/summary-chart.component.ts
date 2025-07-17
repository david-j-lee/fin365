import { Component, Input, OnInit, WritableSignal, inject } from '@angular/core'
import { barOptions } from '@constants/chart.constants'
import { colorsRgb } from '@constants/color.constants'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import { SummaryChart } from '@interfaces/summary-chart.interface'
import { FinanceService } from '@services/finance.service'
import { getAlpha } from '@utilities/rule.utilities'
import { BaseChartDirective } from 'ng2-charts'

const baseOpacity = 0.5

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
      if (event.resource === 'budget' || event.resource === 'revenue') {
        this.setChart()
      }
    })
  }

  private setChart() {
    if (!this.financeService.budget?.revenues || !this.ruleType) {
      return
    }

    const records = this.financeService.budget[
      RulesMetadata[this.ruleType].budgetFieldKey
    ] as WritableSignal<Rule[]>
    const count = records().length
    const data: number[] = []
    const labels: string[] = []
    const backgroundColors: string[] = []

    records()
      .toSorted((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((revenue, index) => {
        data.push(revenue.yearlyAmount)
        labels.push(revenue.description)

        const rgb = colorsRgb[this.ruleType as keyof typeof colorsRgb]
        const intensity = 1 - index / (count - 1)
        const alpha = getAlpha(baseOpacity, intensity)

        backgroundColors.push(`rgba(${rgb}, ${alpha})`)
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
