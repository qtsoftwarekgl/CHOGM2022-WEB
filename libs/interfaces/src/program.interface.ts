export interface IRating {
  stars: number;
  user: any;
  comment: string;
  createdDate?: string;
}

export interface IRate {
  rate: number;
  rating: IRating[];
}

export interface IProgramme {
  forum: any;
  room: any;
  startDate: any;
  endDate: any;
  title: string;
  description: string;
  speakers: string[];
  moderator: string[];
  broadcastLink: string;
  rating?: IRate;
}
