import { Moment } from 'moment';

export interface Snapshot {
  id: number | string;
  date: Moment;
  estimatedBalance: number;
  actualBalance: number;
  balanceDifference: number;
}
