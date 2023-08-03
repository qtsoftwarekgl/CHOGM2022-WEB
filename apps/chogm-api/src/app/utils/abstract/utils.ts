import { Types } from 'mongoose';

export const createdBy = (userId: string): any => {
  return {
    user: new Types.ObjectId(userId),
    date: localDate(new Date()),
  };
};

export const localDate = (date: Date): string => {
  return new Date(
    date?.setHours(date?.getHours() - date?.getTimezoneOffset() / 60)
  ).toISOString();
};

export const expiryDate = (): string => {
  const today = new Date();
  return localDate(new Date(today.setHours(today.getHours() + 24)));
};
