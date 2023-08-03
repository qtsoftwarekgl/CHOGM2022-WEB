import { ECMSTypes, EQAtypes } from '@chogm2022/enums';
import { IAbstractCms } from './abstract-cms.interface';

export interface ICMS extends IAbstractCms {
  category: ECMSTypes;
  qaType?: EQAtypes;
  createdDate: Date;
}
