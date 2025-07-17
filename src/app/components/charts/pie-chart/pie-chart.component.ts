import { CurrencyPipe } from '@angular/common'
import { Component, Input, OnInit, WritableSignal, inject } from '@angular/core'
import { pieOptions } from '@constants/chart.constants'
import { colorPalettes, colorsRgb } from '@constants/color.constants'
import { PieChart } from '@interfaces/pie-chart.interface'
import { Rule, RuleType, RulesMetadata } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { getAlpha } from '@utilities/rule.utilities'
import { BaseChartDirective } from 'ng2-charts'

const baseOpacity = 0.5

@Component({
  selector: 'app-pie-chart',
  templateUrl: 'pie-chart.component.html',
  imports: [BaseChartDirective, CurrencyPipe],
})
export class PieChartComponent implements OnInit {
  private financeService = inject(FinanceService)

  @Input() ruleType: RuleType | null = null
  @Input() totalSuffix?: string

  chart: PieChart = {
    chartType: 'doughnut',
    options: pieOptions,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    },
    total: 0,
  }

  ngOnInit() {
    this.financeService.events.subscribe((event) => {
      if (event.resource === 'budget' || event.resource === 'balance') {
        this.setChart()
      }
    })
  }

  private setChart() {
    if (!this.financeService.budget || !this.ruleType) {
      return
    }

    const records = this.financeService.budget[
      RulesMetadata[this.ruleType].budgetFieldKey
    ] as WritableSignal<Rule[]>
    const count = records().length

    let total = 0
    const data: number[] = []
    const labels: string[] = []
    const backgroundColors: string[] = []

    records()
      .sort((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((balance, index) => {
        data.push(balance.yearlyAmount)
        labels.push(balance.description)

        const rgb = colorsRgb[this.ruleType as keyof typeof colorsRgb]
        const intensity = 1 - index / (count - 1)
        const alpha = getAlpha(baseOpacity, intensity)

        backgroundColors.push(`rgba(${rgb}, ${alpha})`)
        total += balance.yearlyAmount
      })

    console.log(backgroundColors)

    this.chart.data = {
      ...this.chart.data,
      labels,
      datasets: [
        {
          ...this.chart.data.datasets[0],
          ...colorPalettes[this.ruleType as keyof typeof colorPalettes],
          backgroundColor: backgroundColors,
          data,
        },
      ],
    }
    this.chart.total = total
  }
}
