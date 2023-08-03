import { EUserRole } from '@chogm2022/enums';
import { User } from '../entities/user.entity';

// generate random strong password
export const generateRandomPassword = (length: number): string => {
  let password = '';
  const possibleUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const possibleLower = 'abcdefghijklmnopqrstuvwxyz';
  const possibleNumber = '1234567890';
  const possibleSpecial = '@#$%^&+=!*()_-[]{};:\'",<.>?~`|';
  for (let i = 0; i < length / 4; i++) {
    password += possibleUpper.charAt(
      Math.floor(Math.random() * possibleUpper.length)
    );
  }
  for (let i = 0; i < length / 4; i++) {
    password += possibleLower.charAt(
      Math.floor(Math.random() * possibleLower.length)
    );
  }
  for (let i = 0; i < length / 4; i++) {
    password += possibleNumber.charAt(
      Math.floor(Math.random() * possibleNumber.length)
    );
  }
  for (let i = 0; i < length / 4; i++) {
    password += possibleSpecial.charAt(
      Math.floor(Math.random() * possibleSpecial.length)
    );
  }
  return password;
};

export const notificationPayload = (
  payloadId: string,
  title: string,
  body: string
): any => {
  return {
    data: {
      payloadId,
    },
    notification: {
      title,
      body,
    },
  };
};

export const notificationPayloadExpo = (
  payloadId: string,
  title: string,
  body: string
): any => {
  return {
    title,
    body,
    data: {
      payloadId,
    },
    priority: 'high',
  };
};

export const rooMavailability = () => {
  return { availability: true, bookable: true };
};

export const stateFull = (user: User) => {
  return user?.role[0] === EUserRole.ATTENDEE ||
    user?.role[0] === EUserRole.SPEAKER ||
    user?.role[0] === EUserRole.MODERATOR
    ? { state: true }
    : {};
};
