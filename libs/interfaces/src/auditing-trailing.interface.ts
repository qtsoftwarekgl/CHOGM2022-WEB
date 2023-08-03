export interface ICreatedBy {
  user: string;
  date: string;
}

export interface IAuditTrack {
  state: boolean;
  createdBy: ICreatedBy;
  updatedBy: ICreatedBy[];
}
