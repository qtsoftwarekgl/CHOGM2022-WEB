import { EVenueType } from '@chogm2022/enums';
import { IAbstractCms } from './abstract-cms.interface';
import { IRate } from './program.interface';

export interface IVenue extends IAbstractCms {
  shortDescription: string;
  venueCategory: EVenueType;
  venueInfo: IVenueInfo;
}

export interface IVenueInfo {
  rating?: IRate;
  contactPhone: string;
  contactEmail: string;
  venueWebsite: string;
  venueStreetAddress: string;
  venueLocationName: string;
  locationLink: string;
  hotelRanking?: number;
}
