import { CurrencyPipe } from '@angular/common'
import { Component, Input, OnInit, inject } from '@angular/core'
import { pieOptions } from '@constants/chart.constants'
import { colorPalettes } from '@constants/color.constants'
import { PieChart } from '@interfaces/pie-chart.interface'
import { RuleType } from '@interfaces/rule.interface'
import { FinanceService } from '@services/finance.service'
import { getRgba, getRulesSignalFromBudget } from '@utilities/rule.utilities'
import { BaseChartDirective } from 'ng2-charts'

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
    let total = 0

    records()
      .sort((a, b) => b.yearlyAmount - a.yearlyAmount)
      .forEach((rule, index) => {
        data.push(rule.yearlyAmount)
        labels.push(rule.description)
        backgroundColors.push(getRgba(this.ruleType, count, index))
        total += rule.yearlyAmount
      })

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
