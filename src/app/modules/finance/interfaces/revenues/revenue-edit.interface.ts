export interface RevenueEdit {
    id: number | string;

    description: string;
    amount: number;

    isForever: boolean;
    frequency: string;

    startDate: any;
    endDate: any;

    repeatMon: boolean;
    repeatTue: boolean;
    repeatWed: boolean;
    repeatThu: boolean;
    repeatFri: boolean;
    repeatSat: boolean;
    repeatSun: boolean;
}
