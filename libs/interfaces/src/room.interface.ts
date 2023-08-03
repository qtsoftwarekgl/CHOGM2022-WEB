import { IAbstractCms } from './abstract-cms.interface';

export interface IRoom extends IAbstractCms {
  venue: any;
  amenities: IRoomAmenities;
}

export interface IRoomAmenities {
  conditioner: boolean;
  wifi: boolean;
  microphone: boolean;
  projector: boolean;
  camera: boolean;
}
