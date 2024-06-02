import { Component, Input, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class LogoComponent implements OnInit {
  @Input() hexColor: string = ''
  @Input() svgWidth: string = ''
  @Input() svgHeight: string = ''

  ngOnInit() {
    this.hexColor = this.hexColor ? `#${this.hexColor}` : '#000000'
  }
}
