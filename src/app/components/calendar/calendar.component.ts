import { DatePipe, DecimalPipe, NgClass } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { CalendarService } from '@services/calendar.service'
import moment, { Moment } from 'moment'

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  imports: [DatePipe, DecimalPipe, MatIcon, MatIconButton, MatTooltip, NgClass],
})
export class CalendarComponent {
  calendarService = inject(CalendarService)

  today: Moment = moment()
}
