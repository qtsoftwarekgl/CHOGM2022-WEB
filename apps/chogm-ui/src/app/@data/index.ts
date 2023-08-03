import {
  ECMSTypes,
  ENotificationType,
  EQAtypes,
  EStatus,
  EUserRole,
  EVenueType,
} from '../enums';

export const qaTypes = [
  {
    id: 1,
    name: 'Accomodation',
    value: EQAtypes.ACCOMODATION,
  },
  {
    id: 2,
    name: 'Accreditation',
    value: EQAtypes.ACCREDITATION,
  },
  {
    id: 3,
    name: 'Media',
    value: EQAtypes.MEDIA,
  },
  {
    id: 4,
    name: 'Opening Ceremony',
    value: EQAtypes.OPENING_CEREMONY,
  },
  {
    id: 5,
    name: 'Security',
    value: EQAtypes.SECURITY,
  },
  {
    id: 6,
    name: 'Telecom',
    value: EQAtypes.TELECOM,
  },
  {
    id: 7,
    name: 'Transport',
    value: EQAtypes.TRANSPORT,
  },
  {
    id: 8,
    name: 'Venues & Hotel Access',
    value: EQAtypes.VENUES_HOTEL_ACCESS,
  },
];

export const cmsTypes = [
  {
    id: 1,
    name: 'About Conference',
    value: ECMSTypes.ABOUT_CONFERENCE,
  },
  {
    id: 2,
    name: 'News',
    value: ECMSTypes.NEWS,
  },
  {
    id: 3,
    name: 'Q&A',
    value: ECMSTypes.QA,
  },
  {
    id: 4,
    name: 'Useful Info',
    value: ECMSTypes.USEFUL_INFO,
  },
  {
    id: 5,
    name: 'Transit Visa',
    value: ECMSTypes.TRANSIT_VISA,
  },
  {
    id: 6,
    name: 'Visa on Arrival',
    value: ECMSTypes.VISA_ON_ARRIVAL,
  },
  {
    id: 7,
    name: 'Visitors VISA',
    value: ECMSTypes.VISITORS_VISA,
  },
  {
    id: 8,
    name: 'Media',
    value: ECMSTypes.MEDIA,
  },
];

export const aboutTypes = [
  {
    id: 1,
    name: 'About Conference',
    value: ECMSTypes.ABOUT_CONFERENCE,
  },
  {
    id: 2,
    name: 'ComSec',
    value: ECMSTypes.COMSEC,
  },
  {
    id: 3,
    name: 'Privacy Policy',
    value: ECMSTypes.PRIVACY_POLICY,
	},
	{
    id: 4,
    name: 'Toll Number',
    value: ECMSTypes.TOLL_NUMBER,
  },
];

export const transportTypes = [
  {
    id: 1,
    name: 'Car Rentals',
    value: ECMSTypes.TRANSPORT_CAR_RENTALS,
  },
  {
    id: 2,
    name: 'Shuttle Services',
    value: ECMSTypes.TRANSPORT_SHUTTLE_SERVICES,
  },
];

export const yesNo = [
  {
    id: 1,
    name: 'Yes',
    value: true,
  },
  {
    id: 2,
    name: 'No',
    value: false,
  },
];

export const initialAmenities: any = {
  camera: false,
  conditioner: false,
  microphone: false,
  projector: false,
  wifi: false,
};

export const venueCategories = [
  {
    id: 1,
    name: 'Art Craft',
    value: EVenueType.ART_CRAFT,
  },
  {
    id: 2,
    name: 'Bar',
    value: EVenueType.BAR_VENUE,
  },
  {
    id: 3,
    name: 'Coffe Shop',
    value: EVenueType.COFFEE_SHOP_VENUE,
  },
  {
    id: 4,
    name: 'Event',
    value: EVenueType.EVENT_VENUE,
  },
  {
    id: 5,
    name: 'Hotel Apartment',
    value: EVenueType.HOTEL_APARTMENT_VENUE,
  },
  {
    id: 6,
    name: 'Museum Memorial',
    value: EVenueType.MUSEUM_MEMORIAL_VENUE,
  },
  {
    id: 7,
    name: 'National Park',
    value: EVenueType.NATIONAL_PARK,
  },
  {
    id: 8,
    name: 'Night Club',
    value: EVenueType.NIGHT_CLUB_VENUE,
  },
  {
    id: 9,
    name: 'Restaurant',
    value: EVenueType.RESTAURANT_VENUE,
  },
  {
    id: 10,
    name: 'Shopping Mall',
    value: EVenueType.SHOPPING_MALL,
  },
  {
    id: 11,
    name: 'Others',
    value: EVenueType.OTHERS,
  },
];

export const roles = [
  {
    id: 1,
    name: 'Admin',
    value: EUserRole.ADMIN,
    permissions: ['all'],
  },
  {
    id: 2,
    name: 'Attendee',
    value: EUserRole.ATTENDEE,
  },
  {
    id: 3,
    name: 'Moderator',
    value: EUserRole.MODERATOR,
  },
  {
    id: 4,
    name: 'Speaker',
    value: EUserRole.SPEAKER,
  },
  {
    id: 5,
    name: 'Coms',
    value: EUserRole.COMS,
    permissions: [
      'about',
      'forums',
      'programmes',
      'news',
      'faqs',
      'information-centre',
      'media',
      'forums',
    ],
  },
  {
    id: 7,
    name: 'Transport',
    value: EUserRole.TRANSPORT,
    permissions: ['transport'],
  },
  {
    id: 9,
    name: 'Command Post',
    value: EUserRole.COMMAND_POST,
    permissions: ['dashboard', 'rooms', 'programmes', 'bookings'],
  },
  {
    id: 10,
    name: 'Hospitality',
    value: EUserRole.HOSPITALITY,
    permissions: ['venues', 'rooms', 'visit-rwanda', 'bookings'],
  },
];

export const events = [
  {
    id: 1463,
    name: "CHOGM 2022 - Women's Forum",
  },
  {
    id: 1559,
    name: 'CHOGM 2022 - Youth Forum',
  },
  {
    id: 2127,
    name: "CHOGM 2022 - People's Forum",
  },
  {
    id: 3232,
    name: 'CHOGM 2022 - Business Forum',
  },
  {
    id: 4326,
    name: 'CHOGM 2022 - Media',
  },
  {
    id: 8064,
    name: 'CHOGM 2022',
  },
];

export const gender = [
  {
    name: 'male',
  },
  {
    name: 'female',
  },
  {
    name: 'other',
  },
  {
    name: 'none',
  },
];

export const notificationTypes = [
  {
    id: 1,
    name: 'Booking Approved',
    value: ENotificationType.BOOKING_APPROVED,
  },
  {
    id: 2,
    name: 'Booking Cancelled',
    value: ENotificationType.BOOKING_CANCELLED,
  },
  {
    id: 3,
    name: 'Booking Request',
    value: ENotificationType.BOOKING_REQUEST,
  },
  {
    id: 4,
    name: 'Booking Room Changed',
    value: ENotificationType.BOOKING_ROOM_CHANGED,
  },
  {
    id: 5,
    name: 'NOC Chat',
    value: ENotificationType.NEW_CHAT_NOC,
  },
  {
    id: 6,
    name: 'Participant Chat',
    value: ENotificationType.NEW_CHAT_PARTICIPANT,
  },
];

export const hotelRankingData = [
  {
    id: 1,
    name: 'Number one (1)',
    value: 1,
  },
  {
    id: 2,
    name: 'Number two (2)',
    value: 2,
  },
  {
    id: 3,
    name: 'Number three (3)',
    value: 3,
  },
  {
    id: 4,
    name: 'Number four (4)',
    value: 4,
  },
  {
    id: 5,
    name: 'Number five (5)',
    value: 5,
  },
  {
    id: 6,
    name: 'Number six (6)',
    value: 6,
  },
  {
    id: 7,
    name: 'Number seven (7)',
    value: 7,
  },
  {
    id: 8,
    name: 'Number eight (8)',
    value: 8,
  },
  {
    id: 9,
    name: 'Number nine (9)',
    value: 9,
  },
  {
    id: 10,
    name: 'Number ten (10)',
    value: 10,
  },
  {
    id: 11,
    name: 'Other',
    value: 11,
  },
];

export const statuses = [
	{
		id: 1,
		name: 'Approved',
		value: EStatus.APPROVED
	},
	{
		id: 2,
		name: 'Cancelled',
		value: EStatus.CANCELLED
	},
	{
		id: 3,
		name: 'Completed',
		value: EStatus.COMPLETED
	},
	{
		id: 4,
		name: 'Pending',
		value: EStatus.PENDING
	},
	{
		id: 5,
		name: 'Approved Reassigned',
		value: EStatus.APPROVED_REASSIGNED
	},
];