import { IAbstractCms } from './abstract-cms.interface';
import { IRate } from './program.interface';

export interface IForum extends IAbstractCms {
  venue: any;
  attendees: string[];
  status: boolean;
  rating?: IRate;
  startDate: Date;
  endDate: Date;
}
