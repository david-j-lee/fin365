import { Component } from '@angular/core';

import { CalendarService } from '../../services/calendar.service';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
})
export class CalendarComponent {
  today: Moment = moment();

  constructor(public calendarService: CalendarService) {}
}
