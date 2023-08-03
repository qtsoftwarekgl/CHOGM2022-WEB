import { EUserRole } from '@chogm2022/enums';
import { IRate } from './program.interface';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: EUserRole[];
  description?: string;
  age?: number;
  status?: boolean;
  avatar?: string;
  biography?: string;
  password?: string;
  rating?: IRate;
}
