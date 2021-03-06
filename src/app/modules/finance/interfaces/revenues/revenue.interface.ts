import { Moment } from 'moment';

import { DailyRevenue } from '../daily/daily-revenue.interface';

export interface Revenue {
    id: number | string;

    description: string;
    amount: number;

    isForever: boolean;
    frequency: string;

    startDate: Moment;
    endDate: Moment;

    repeatMon: boolean;
    repeatTue: boolean;
    repeatWed: boolean;
    repeatThu: boolean;
    repeatFri: boolean;
    repeatSat: boolean;
    repeatSun: boolean;

    yearlyAmount: number;

    dailyRevenues: DailyRevenue[];
}
