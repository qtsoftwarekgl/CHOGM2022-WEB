const EVENT_EXIST =
  'The selected even name have been used, please use another name';
const EVENT_DOES_NOT_EXIST = 'Event does not exist';
const ROOM_DOES_NOT_EXIST = 'Room does not exist';
const ROOM_EXIST = 'Room exist, please use another room name';
const USER_EXIST = 'User exist, please use another email.';
const VENU_EXIST = 'venue exist, please use another venue name';
const VENUE_NOT_EXIST = 'Error, It seems that the event venue does not exist';
const INVALID_CREDENTIALS = 'Invalid credentials';
const USER_DOESNT_EXIT = 'User account does not exits';
const IMVALID_TOKEN = 'Invalid token';
const PRGRAM_EXIST = 'Program/Session exist, please use another title';
const CONTENT_EXIST = 'Content exist, use another name';
const NOT_IMAGE_TYPE = 'The file you are trying to upload in not an image';
const INVALID_QR = 'the qrcode is invalid';
const CHAT_IS_NOT_NEW = 'Chat is not new';
const ALLREADY_REGISTERED = 'You are already registered to attend this forum';
const ALLREADY_RATED = 'You can not rate twice';
const ALLREADY_BOOKED =
  'You Allready requested this room for booking, wait for approval';
const ROOM_IS_NOT_AVAILABLE = 'The room you requested is not available';
const BOOKING_SHOULD_BE_IN_FUTURE = 'Booking should be in future';
const YOU_CANT_APPROVE =
  'You can not approve this booking as this room is already booked and approved on the overlapping time';

const PICK_ANOTHER_TIME_ROOM_BOOKING = (from: Date, to: Date) =>
  `This room is not available in time range you choosed, pick an ealier or future time because it's currently booked from ${from} to ${to}`;
const NOT_PDF_TYPE = 'The file you are trying to upload in not a PDF';
const VERIFICATION_CODE_EXPIRED = 'Verification code has expired';
const VERIFICATION_CODE_INVALID = 'verification code is invalid';
const ACCOUNT_DEACTIVATED = 'Account de-activated';
const ACCOUNT_NOT_FOUND =
  'Account not found or registered, please contact the admin';
const INTERNAL_SERVER_ERROR =
  'Something went wrong, try again or contact the admin';
const SERVICE_UNAVAILABLE =
  'Service is temporaly unavailable, please contact the admin';

const INVALID_OTP = 'Invalid OTP, please try again';
const BOOKING_INVALID_DATE_RANGE =
  'Meeting rooms can only be booked between 8.00 AM to 8.00 PM.';

export default {
  EVENT_EXIST,
  ROOM_EXIST,
  USER_DOESNT_EXIT,
  USER_EXIST,
  VENUE_NOT_EXIST,
  VENU_EXIST,
  IMVALID_TOKEN,
  INVALID_CREDENTIALS,
  PRGRAM_EXIST,
  EVENT_DOES_NOT_EXIST,
  ROOM_DOES_NOT_EXIST,
  CONTENT_EXIST,
  NOT_IMAGE_TYPE,
  INVALID_QR,
  CHAT_IS_NOT_NEW,
  ALLREADY_REGISTERED,
  ALLREADY_RATED,
  ALLREADY_BOOKED,
  ROOM_IS_NOT_AVAILABLE,
  BOOKING_SHOULD_BE_IN_FUTURE,
  YOU_CANT_APPROVE,
  PICK_ANOTHER_TIME_ROOM_BOOKING,
  NOT_PDF_TYPE,
  VERIFICATION_CODE_EXPIRED,
  VERIFICATION_CODE_INVALID,
  ACCOUNT_DEACTIVATED,
  ACCOUNT_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE,
  INVALID_OTP,
  BOOKING_INVALID_DATE_RANGE,
};
