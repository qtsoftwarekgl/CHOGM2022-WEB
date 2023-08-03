import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AllStats = {
  __typename?: 'AllStats';
  business: CmsStat;
  chogm: CmsStat;
  media: CmsStat;
  people: CmsStat;
  women: CmsStat;
  youth: CmsStat;
};

export type AmenitiesInput = {
  camera: Scalars['Boolean'];
  conditioner: Scalars['Boolean'];
  microphone: Scalars['Boolean'];
  projector: Scalars['Boolean'];
  wifi: Scalars['Boolean'];
};

export type ApproveBookingInput = {
  bookingId: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  room?: InputMaybe<Scalars['String']>;
  status: EStatus;
};

export type Booking = {
  __typename?: 'Booking';
  _id: Scalars['ID'];
  actionUser: CreatedBy;
  createdDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  oldroom: Room;
  room: Room;
  startDate: Scalars['DateTime'];
  status: EStatus;
  user: User;
};

export type CatType = {
  __typename?: 'CatType';
  count: Scalars['Float'];
  name: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  chatType: EChatType;
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  messages: Array<Message>;
  queryType: EqAtypes;
  users?: Maybe<Array<User>>;
};

export type ChogmLoginInput = {
  email: Scalars['String'];
  qrdata: Scalars['String'];
};

export type Cms = {
  __typename?: 'Cms';
  category: EcmsTypes;
  createdBy: CreatedBy;
  createdDate: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  otherInfo?: Maybe<OtherInfo>;
  qaType?: Maybe<EqAtypes>;
  state: Scalars['Boolean'];
  thumbnail?: Maybe<Scalars['String']>;
  updatedBy: Array<CreatedBy>;
  updatedDate: Scalars['DateTime'];
};

export type CmsCategoryInput = {
  category: EcmsTypes;
};

export type CmsStat = {
  __typename?: 'CmsStat';
  categories: Array<CatType>;
  gender: Array<GenderType>;
  registered: Scalars['Float'];
};

export type ConvidResult = {
  __typename?: 'ConvidResult';
  testDate?: Maybe<Scalars['String']>;
  testResult?: Maybe<Scalars['String']>;
  testType?: Maybe<Scalars['String']>;
};

export type CreateBookingInput = {
  endDate: Scalars['DateTime'];
  room: Scalars['String'];
  startDate: Scalars['DateTime'];
  user: Scalars['String'];
};

export type CreateChatInput = {
  message: Scalars['String'];
  queryType: EqAtypes;
  receiver?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['String']>;
};

export type CreateCmsInput = {
  category: EcmsTypes;
  description: Scalars['String'];
  name: Scalars['String'];
  otherInfo?: InputMaybe<OtherInfoInput>;
  qaType?: InputMaybe<EqAtypes>;
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type CreateForumInput = {
  attendees?: InputMaybe<Array<Scalars['String']>>;
  description: Scalars['String'];
  endDate: Scalars['DateTime'];
  name: Scalars['String'];
  startDate: Scalars['DateTime'];
  state?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['Boolean']>;
  thumbnail: Scalars['String'];
  venue: Scalars['String'];
};

export type CreateProgrammeInput = {
  broadcastLink?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  endDate: Scalars['DateTime'];
  forum: Scalars['String'];
  moderator: Array<Scalars['String']>;
  room?: InputMaybe<Scalars['String']>;
  speakers: Array<Scalars['String']>;
  startDate: Scalars['DateTime'];
  state?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
};

export type CreateRoomInput = {
  amenities: AmenitiesInput;
  bookable: Scalars['Boolean'];
  capacity: Scalars['Float'];
  description: Scalars['String'];
  isMediaRoom: Scalars['Boolean'];
  name: Scalars['String'];
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail: Scalars['String'];
  venue: Scalars['String'];
};

export type CreateUserInput = {
  age?: InputMaybe<Scalars['Float']>;
  avatar?: InputMaybe<Scalars['String']>;
  biography?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  gender?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  nationality?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  passport?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  qrcodeData?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Array<Scalars['Float']>>;
  residenceCountry?: InputMaybe<Scalars['String']>;
  role: Array<EUserRole>;
  showNoc?: InputMaybe<Scalars['Boolean']>;
  state?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateVenueInput = {
  description: Scalars['String'];
  name: Scalars['String'];
  shortDescription: Scalars['String'];
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail: Scalars['String'];
  venueCategory: EVenueType;
  venueInfo: VenueInfoInput;
};

export type CreatedBy = {
  __typename?: 'CreatedBy';
  date: Scalars['String'];
  user?: Maybe<User>;
};

export type DateRangeInput = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export enum EcmsTypes {
  AboutConference = 'ABOUT_CONFERENCE',
  Comsec = 'COMSEC',
  Media = 'MEDIA',
  News = 'NEWS',
  PrivacyPolicy = 'PRIVACY_POLICY',
  Qa = 'QA',
  TollNumber = 'TOLL_NUMBER',
  TransitVisa = 'TRANSIT_VISA',
  TransportCarRentals = 'TRANSPORT_CAR_RENTALS',
  TransportShuttleServices = 'TRANSPORT_SHUTTLE_SERVICES',
  UsefulInfo = 'USEFUL_INFO',
  VisaOnArrival = 'VISA_ON_ARRIVAL',
  VisitorsVisa = 'VISITORS_VISA'
}

export enum EChatType {
  Noc = 'NOC',
  Participant = 'PARTICIPANT'
}

export enum ENotificationType {
  BookingApproved = 'BOOKING_APPROVED',
  BookingCancelled = 'BOOKING_CANCELLED',
  BookingRequest = 'BOOKING_REQUEST',
  BookingRoomChanged = 'BOOKING_ROOM_CHANGED',
  BroadcastMessage = 'BROADCAST_MESSAGE',
  CovidResult = 'COVID_RESULT',
  NewChatNoc = 'NEW_CHAT_NOC',
  NewChatParticipant = 'NEW_CHAT_PARTICIPANT'
}

export enum EqAtypes {
  Accomodation = 'ACCOMODATION',
  Accreditation = 'ACCREDITATION',
  Media = 'MEDIA',
  OpeningCeremony = 'OPENING_CEREMONY',
  Security = 'SECURITY',
  Telecom = 'TELECOM',
  Transport = 'TRANSPORT',
  VenuesHotelAccess = 'VENUES_HOTEL_ACCESS'
}

export enum EStatus {
  Approved = 'APPROVED',
  ApprovedReassigned = 'APPROVED_REASSIGNED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export enum EUserRole {
  Admin = 'ADMIN',
  Attendee = 'ATTENDEE',
  CommandPost = 'COMMAND_POST',
  CommunicationManager = 'COMMUNICATION_MANAGER',
  Coms = 'COMS',
  ContentManager = 'CONTENT_MANAGER',
  FrontDesk = 'FRONT_DESK',
  Hospitality = 'HOSPITALITY',
  Moderator = 'MODERATOR',
  Speaker = 'SPEAKER',
  Transport = 'TRANSPORT',
  TransportManager = 'TRANSPORT_MANAGER',
  VenuesManager = 'VENUES_MANAGER'
}

export enum EVenueType {
  ArtCraft = 'ART_CRAFT',
  BarVenue = 'BAR_VENUE',
  CoffeeShopVenue = 'COFFEE_SHOP_VENUE',
  EventVenue = 'EVENT_VENUE',
  HotelApartmentVenue = 'HOTEL_APARTMENT_VENUE',
  MuseumMemorialVenue = 'MUSEUM_MEMORIAL_VENUE',
  NationalPark = 'NATIONAL_PARK',
  NightClubVenue = 'NIGHT_CLUB_VENUE',
  Others = 'OTHERS',
  RestaurantVenue = 'RESTAURANT_VENUE',
  ShoppingMall = 'SHOPPING_MALL'
}

export type Forum = {
  __typename?: 'Forum';
  attendees: Array<Scalars['String']>;
  createdBy: CreatedBy;
  description: Scalars['String'];
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  rating: Rate;
  startDate: Scalars['DateTime'];
  state: Scalars['Boolean'];
  status: Scalars['Boolean'];
  thumbnail: Scalars['String'];
  updatedBy: Array<CreatedBy>;
  venue: Venue;
};

export type GenderType = {
  __typename?: 'GenderType';
  female: Scalars['Float'];
  male: Scalars['Float'];
  none: Scalars['Float'];
  other: Scalars['Float'];
  total: Scalars['Float'];
};

export type Identity = {
  __typename?: 'Identity';
  identityNumber: Scalars['String'];
  identityType: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  createdDate: Scalars['String'];
  message: Scalars['String'];
  sender?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  BroadcastMessage: Scalars['Boolean'];
  UserLogin: UserToken;
  /** Api for admin to approve booking */
  approveBooking: Booking;
  chogmLogin: UserToken;
  createBooking: Booking;
  createCms: Cms;
  createForum: Forum;
  createProgramme: Programme;
  createRoom: Room;
  createUser: User;
  createVenue: Venue;
  deviceRegistrationToken: User;
  generateOtp: Scalars['Boolean'];
  otpLogin: UserToken;
  rateForum: Forum;
  rateProgramme: Programme;
  rateUser: User;
  rateVenue: Venue;
  registerToAttendForum: Forum;
  replyChat: Chat;
  resetPassword: Scalars['Boolean'];
  sendNewChat: Chat;
  updateCms: Cms;
  updateForum: Forum;
  updateNotification: Scalars['Boolean'];
  updateProgramme: Programme;
  updateRoom: Room;
  updateUser: User;
  updateVenue: Venue;
  uploadFile: Scalars['String'];
  uploadPDFFile: Scalars['String'];
  verifyEmail: Scalars['Boolean'];
};


export type MutationBroadcastMessageArgs = {
  message: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUserLoginArgs = {
  UserLoginInput: UserLoginInput;
};


export type MutationApproveBookingArgs = {
  ApproveBookingInput: ApproveBookingInput;
};


export type MutationChogmLoginArgs = {
  ChogmLoginInput: ChogmLoginInput;
};


export type MutationCreateBookingArgs = {
  CreateBookingInput: CreateBookingInput;
};


export type MutationCreateCmsArgs = {
  CreateCmsInput: CreateCmsInput;
};


export type MutationCreateForumArgs = {
  createForumInput: CreateForumInput;
};


export type MutationCreateProgrammeArgs = {
  createProgrammeInput: CreateProgrammeInput;
};


export type MutationCreateRoomArgs = {
  createRoomInput: CreateRoomInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationCreateVenueArgs = {
  createVenueInput: CreateVenueInput;
};


export type MutationDeviceRegistrationTokenArgs = {
  registrationId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationGenerateOtpArgs = {
  email: Scalars['String'];
};


export type MutationOtpLoginArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
};


export type MutationRateForumArgs = {
  RatingInput: RatingInput;
  forumId: Scalars['String'];
};


export type MutationRateProgrammeArgs = {
  RatingInput: RatingInput;
  programmeId: Scalars['String'];
};


export type MutationRateUserArgs = {
  RatingInput: RatingInput;
  userId: Scalars['String'];
};


export type MutationRateVenueArgs = {
  RatingInput: RatingInput;
  venueId: Scalars['String'];
};


export type MutationRegisterToAttendForumArgs = {
  forumId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationReplyChatArgs = {
  ReplyChatInput: ReplyChatInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  verificationCode: Scalars['Float'];
};


export type MutationSendNewChatArgs = {
  createChatInput: CreateChatInput;
};


export type MutationUpdateCmsArgs = {
  UpdateCmsInput: UpdateCmsInput;
};


export type MutationUpdateForumArgs = {
  createForumInput: UpdateForumInput;
};


export type MutationUpdateNotificationArgs = {
  UpdateSeenNotificationInput: UpdateSeenNotificationInput;
};


export type MutationUpdateProgrammeArgs = {
  UpdateProgrammeInput: UpdateProgrammeInput;
};


export type MutationUpdateRoomArgs = {
  UpdateRoomInput: UpdateRoomInput;
};


export type MutationUpdateUserArgs = {
  UpdateUserInput: UpdateUserInput;
};


export type MutationUpdateVenueArgs = {
  UpdateVenueInput: UpdateVenueInput;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
};


export type MutationUploadPdfFileArgs = {
  file: Scalars['Upload'];
};


export type MutationVerifyEmailArgs = {
  email: Scalars['String'];
};

export type Notification = {
  __typename?: 'Notification';
  content: Scalars['String'];
  createdDate: Scalars['DateTime'];
  id: Scalars['ID'];
  payload: NotificationPayload;
  receiverId: Scalars['String'];
  seen: Scalars['Boolean'];
  type: ENotificationType;
  userId: Scalars['String'];
};

export type NotificationPayload = {
  __typename?: 'NotificationPayload';
  createdBy: CreatedBy;
  from?: Maybe<User>;
  payloadId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type OtherInfo = {
  __typename?: 'OtherInfo';
  contactEmail?: Maybe<Scalars['String']>;
  contactPhone?: Maybe<Scalars['String']>;
  pdfFile: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};

export type OtherInfoInput = {
  contactEmail?: InputMaybe<Scalars['String']>;
  contactPhone?: InputMaybe<Scalars['String']>;
  pdfFile?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type Programme = {
  __typename?: 'Programme';
  broadcastLink?: Maybe<Scalars['String']>;
  createdBy: CreatedBy;
  description: Scalars['String'];
  endDate: Scalars['DateTime'];
  forum: Forum;
  id: Scalars['ID'];
  moderator: Array<User>;
  rating: Rate;
  room?: Maybe<Room>;
  speakers: Array<User>;
  startDate: Scalars['DateTime'];
  state: Scalars['Boolean'];
  title: Scalars['String'];
  updatedBy: Array<CreatedBy>;
};

export type Query = {
  __typename?: 'Query';
  aboutConference: Cms;
  allCms: Array<Cms>;
  availableRooms: Array<Room>;
  /** Query to fetch rooms by date range filter object */
  availableRoomsDateRange: Array<Room>;
  booking: Booking;
  bookings: Array<Booking>;
  broadcastedMessages: Array<Notification>;
  categorizedChats: Array<Chat>;
  chats: Array<Chat>;
  chatsById: Chat;
  chatsByNOC: Array<Chat>;
  cms: Cms;
  cmsByCategory: Array<Cms>;
  cmsStats: AllStats;
  covidResult: ConvidResult;
  forum: Forum;
  forums: Array<Forum>;
  forumsByvenue: Array<Forum>;
  news: Array<Cms>;
  notifications: Array<Notification>;
  notificationsByUser: Array<Notification>;
  privacyPolicy: Cms;
  programme: Programme;
  programmes?: Maybe<Array<Programme>>;
  /** Query to fetch programms/sessions by forum id */
  programmesByForum: Array<Programme>;
  /** Query to fetch programms/sessions by speaker/moderator id */
  programmesByUser: Array<Programme>;
  room: Room;
  /** Query to fetch rooms by amenities filter object */
  roomByAmenities: Array<Room>;
  rooms: Array<Room>;
  /** Query to fetch rooms by venueId */
  roomsByAvenue: Array<Room>;
  /** Query to fetch speakers by forum */
  speakersByForum: SpeakerSModerator;
  takenRanks: Array<Scalars['Float']>;
  tollNumber: Cms;
  user: User;
  users: Array<User>;
  /** query users by array of user ids */
  usersByIds: Array<User>;
  /** query users by user role */
  usersByRole: Array<User>;
  usersCount: Scalars['Float'];
  usersSearch: Array<User>;
  venue: Venue;
  venues: Array<Venue>;
  venuesByCategoy: Array<Venue>;
};


export type QueryAvailableRoomsDateRangeArgs = {
  dateRangeInput: DateRangeInput;
};


export type QueryBookingArgs = {
  id: Scalars['String'];
};


export type QueryCategorizedChatsArgs = {
  queryTypeInput: QueryTypeInput;
};


export type QueryChatsArgs = {
  userId: Scalars['String'];
};


export type QueryChatsByIdArgs = {
  chatId: Scalars['String'];
};


export type QueryCmsArgs = {
  id: Scalars['String'];
};


export type QueryCmsByCategoryArgs = {
  CmsCategoryInput: CmsCategoryInput;
};


export type QueryForumArgs = {
  id: Scalars['String'];
};


export type QueryForumsByvenueArgs = {
  venueId: Scalars['String'];
};


export type QueryNotificationsByUserArgs = {
  userId: Scalars['String'];
};


export type QueryProgrammeArgs = {
  id: Scalars['String'];
};


export type QueryProgrammesByForumArgs = {
  forumId: Scalars['String'];
};


export type QueryProgrammesByUserArgs = {
  userId: Scalars['String'];
};


export type QueryRoomArgs = {
  id: Scalars['String'];
};


export type QueryRoomByAmenitiesArgs = {
  AmenitiesInput: AmenitiesInput;
};


export type QueryRoomsByAvenueArgs = {
  venueId: Scalars['String'];
};


export type QuerySpeakersByForumArgs = {
  forumId: Scalars['String'];
};


export type QueryTakenRanksArgs = {
  VenueCategoryInput: VenueCategoryInput;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  limit: Scalars['Float'];
  skip: Scalars['Float'];
};


export type QueryUsersByIdsArgs = {
  UserIdsInput: UserIdsInput;
};


export type QueryUsersByRoleArgs = {
  RoleInput: RolesInput;
};


export type QueryUsersSearchArgs = {
  searchInput: Scalars['String'];
};


export type QueryVenueArgs = {
  id: Scalars['String'];
};


export type QueryVenuesByCategoyArgs = {
  VenueCategoryInput: VenueCategoryInput;
};

export type Rate = {
  __typename?: 'Rate';
  rate: Scalars['Float'];
  rating: Array<Rating>;
};

export type Rating = {
  __typename?: 'Rating';
  comment: Scalars['String'];
  createdDate: Scalars['String'];
  stars: Scalars['Float'];
  user: User;
};

export type RatingInput = {
  comment: Scalars['String'];
  createdDate?: InputMaybe<Scalars['String']>;
  rate: Scalars['Float'];
  user: Scalars['String'];
};

export type ReplyChatInput = {
  chatId: Scalars['String'];
  message: Scalars['String'];
  sender?: InputMaybe<Scalars['String']>;
};

export type RolesInput = {
  roles: Array<EUserRole>;
};

export type Room = {
  __typename?: 'Room';
  amenities: RoomAmenities;
  availability: Scalars['Boolean'];
  bookable: Scalars['Boolean'];
  capacity: Scalars['Float'];
  createdBy: CreatedBy;
  description: Scalars['String'];
  id: Scalars['ID'];
  isMediaRoom: Scalars['Boolean'];
  name: Scalars['String'];
  state: Scalars['Boolean'];
  thumbnail: Scalars['String'];
  updatedBy: Array<CreatedBy>;
  venue: Venue;
};

export type RoomAmenities = {
  __typename?: 'RoomAmenities';
  camera: Scalars['Boolean'];
  conditioner: Scalars['Boolean'];
  microphone: Scalars['Boolean'];
  projector: Scalars['Boolean'];
  wifi: Scalars['Boolean'];
};

export type SpeakerSModerator = {
  __typename?: 'SpeakerSModerator';
  moderators: Array<User>;
  speakers: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  bookingRequestEvent: Booking;
  chatEvent: Chat;
  notificationEvent: Notification;
  queryChatEvent: Chat;
  userChatEvent: Chat;
  userNotificationEvent: Notification;
};


export type SubscriptionQueryChatEventArgs = {
  queryTypeInput: QueryTypeInput;
};


export type SubscriptionUserChatEventArgs = {
  userId: Scalars['String'];
};


export type SubscriptionUserNotificationEventArgs = {
  userId: Scalars['String'];
};

export type UpdateCmsInput = {
  category?: InputMaybe<EcmsTypes>;
  cmsId: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  otherInfo?: InputMaybe<OtherInfoInput>;
  qaType?: InputMaybe<EqAtypes>;
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type UpdateForumInput = {
  attendees?: InputMaybe<Array<Scalars['String']>>;
  description?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  forumId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['Boolean']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
};

export type UpdateProgrammeInput = {
  broadcastLink?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  forum?: InputMaybe<Scalars['String']>;
  moderator?: InputMaybe<Array<Scalars['String']>>;
  programmeId: Scalars['String'];
  room?: InputMaybe<Scalars['String']>;
  speakers?: InputMaybe<Array<Scalars['String']>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateRoomInput = {
  amenities?: InputMaybe<AmenitiesInput>;
  bookable?: InputMaybe<Scalars['Boolean']>;
  capacity?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  isMediaRoom?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  roomId: Scalars['String'];
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
};

export type UpdateSeenNotificationInput = {
  notificationIds: Array<Scalars['String']>;
};

export type UpdateUserInput = {
  age?: InputMaybe<Scalars['Float']>;
  avatar?: InputMaybe<Scalars['String']>;
  biography?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  nationality?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  passport?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  qrcodeData?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Array<Scalars['Float']>>;
  residenceCountry?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Array<EUserRole>>;
  showNoc?: InputMaybe<Scalars['Boolean']>;
  state?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type UpdateVenueInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shortDescription?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['Boolean']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  venueCategory?: InputMaybe<EVenueType>;
  venueId: Scalars['String'];
  venueInfo?: InputMaybe<VenueInfoInput>;
};

export type User = {
  __typename?: 'User';
  accreditationId: Scalars['String'];
  age?: Maybe<Scalars['Float']>;
  avatar: Scalars['String'];
  biography: Scalars['String'];
  category?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  covidResult: ConvidResult;
  createdBy: CreatedBy;
  dateOfBirth?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  deviceRegistrationId: Scalars['String'];
  email: Scalars['String'];
  events: Array<Scalars['Float']>;
  firstName: Scalars['String'];
  gender?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  identity: Identity;
  lastName: Scalars['String'];
  nationality?: Maybe<Scalars['String']>;
  occupation?: Maybe<Scalars['String']>;
  passport?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  qrcodeData?: Maybe<Scalars['String']>;
  rating: Rate;
  residenceCountry?: Maybe<Scalars['String']>;
  role: Array<EUserRole>;
  showNoc: Scalars['Boolean'];
  state: Scalars['Boolean'];
  status: Scalars['Boolean'];
  title?: Maybe<Scalars['String']>;
  updatedBy: Array<CreatedBy>;
  verificationCode: Verification;
};

export type UserIdsInput = {
  userIds: Array<Scalars['String']>;
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserToken = {
  __typename?: 'UserToken';
  token: Scalars['String'];
  user: User;
};

export type Venue = {
  __typename?: 'Venue';
  createdBy: CreatedBy;
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  rating: Rate;
  shortDescription: Scalars['String'];
  state: Scalars['Boolean'];
  thumbnail: Scalars['String'];
  updatedBy: Array<CreatedBy>;
  venueCategory: EVenueType;
  venueInfo: VenueInfo;
};

export type VenueCategoryInput = {
  category: EVenueType;
};

export type VenueInfo = {
  __typename?: 'VenueInfo';
  contactEmail?: Maybe<Scalars['String']>;
  contactPhone?: Maybe<Scalars['String']>;
  hotelRanking?: Maybe<Scalars['Float']>;
  locationLink: Scalars['String'];
  venueLocationName?: Maybe<Scalars['String']>;
  venueStreetAddress?: Maybe<Scalars['String']>;
  venueWebsite?: Maybe<Scalars['String']>;
};

export type VenueInfoInput = {
  contactEmail?: InputMaybe<Scalars['String']>;
  contactPhone?: InputMaybe<Scalars['String']>;
  hotelRanking?: InputMaybe<Scalars['Float']>;
  locationLink: Scalars['String'];
  venueLocationName?: InputMaybe<Scalars['String']>;
  venueStreetAddress?: InputMaybe<Scalars['String']>;
  venueWebsite?: InputMaybe<Scalars['String']>;
};

export type Verification = {
  __typename?: 'Verification';
  code: Scalars['String'];
  expiryDate: Scalars['String'];
};

export type QueryTypeInput = {
  queryType: EqAtypes;
};

export type UpdateNotificationMutationVariables = Exact<{
  ids: UpdateSeenNotificationInput;
}>;


export type UpdateNotificationMutation = { __typename?: 'Mutation', updateNotification: boolean };

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = { __typename?: 'Query', notifications: Array<{ __typename?: 'Notification', content: string, id: string, type: ENotificationType, seen: boolean, createdDate: any, payload: { __typename?: 'NotificationPayload', payloadId?: string | null, from?: { __typename?: 'User', id: string, avatar: string, firstName: string, lastName: string } | null } }> };

export type NotificationEventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationEventSubscription = { __typename?: 'Subscription', notificationEvent: { __typename?: 'Notification', content: string, id: string, type: ENotificationType, userId: string, seen: boolean, createdDate: any, payload: { __typename?: 'NotificationPayload', payloadId?: string | null } } };

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: string };

export type CmsByCategoryQueryVariables = Exact<{
  category: CmsCategoryInput;
}>;


export type CmsByCategoryQuery = { __typename?: 'Query', cmsByCategory: Array<{ __typename?: 'Cms', id: string, name: string, category: EcmsTypes, description: string, qaType?: EqAtypes | null, thumbnail?: string | null, createdDate: any, updatedDate: any, state: boolean, otherInfo?: { __typename?: 'OtherInfo', contactEmail?: string | null, contactPhone?: string | null, website?: string | null, pdfFile: string } | null, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> }> };

export type CmsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type CmsQuery = { __typename?: 'Query', cms: { __typename?: 'Cms', id: string, name: string, category: EcmsTypes, description: string, qaType?: EqAtypes | null, thumbnail?: string | null, createdDate: any, updatedDate: any, state: boolean, otherInfo?: { __typename?: 'OtherInfo', contactEmail?: string | null, contactPhone?: string | null, website?: string | null, pdfFile: string } | null, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> } };

export type ApproveBookingMutationVariables = Exact<{
  booking: ApproveBookingInput;
}>;


export type ApproveBookingMutation = { __typename?: 'Mutation', approveBooking: { __typename?: 'Booking', id: string, startDate: any, endDate: any, status: EStatus, message?: string | null } };

export type BookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingsQuery = { __typename?: 'Query', bookings: Array<{ __typename?: 'Booking', id: string, startDate: any, endDate: any, status: EStatus, createdDate: any, room: { __typename?: 'Room', id: string, name: string, thumbnail: string, availability: boolean, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, projector: boolean, microphone: boolean, wifi: boolean }, venue: { __typename?: 'Venue', id: string, name: string } }, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> };

export type BookingRequestSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BookingRequestSubscription = { __typename?: 'Subscription', bookingRequestEvent: { __typename?: 'Booking', id: string, startDate: any, endDate: any, status: EStatus, room: { __typename?: 'Room', id: string, name: string, thumbnail: string, availability: boolean, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, projector: boolean, microphone: boolean, wifi: boolean }, venue: { __typename?: 'Venue', id: string, name: string } }, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } } };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  verificationCode: Scalars['Float'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SendNewChatMutationVariables = Exact<{
  chat: CreateChatInput;
}>;


export type SendNewChatMutation = { __typename?: 'Mutation', sendNewChat: { __typename?: 'Chat', chatType: EChatType, id: string, createdDate: any } };

export type ReplyChatMutationVariables = Exact<{
  reply: ReplyChatInput;
}>;


export type ReplyChatMutation = { __typename?: 'Mutation', replyChat: { __typename?: 'Chat', createdDate: any, messages: Array<{ __typename?: 'Message', createdDate: string, message: string, sender?: string | null }> } };

export type BroadcastMessageMutationVariables = Exact<{
  message: Scalars['String'];
  title: Scalars['String'];
}>;


export type BroadcastMessageMutation = { __typename?: 'Mutation', BroadcastMessage: boolean };

export type GetChatsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetChatsQuery = { __typename?: 'Query', chats: Array<{ __typename?: 'Chat', id: string, queryType: EqAtypes, chatType: EChatType, messages: Array<{ __typename?: 'Message', message: string, sender?: string | null, createdDate: string }>, users?: Array<{ __typename?: 'User', id: string, lastName: string, firstName: string, avatar: string }> | null }> };

export type GetChatsByNocQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsByNocQuery = { __typename?: 'Query', chatsByNOC: Array<{ __typename?: 'Chat', id: string, chatType: EChatType, queryType: EqAtypes, createdDate: any, messages: Array<{ __typename?: 'Message', message: string, sender?: string | null, createdDate: string }>, users?: Array<{ __typename?: 'User', id: string, lastName: string, firstName: string, avatar: string }> | null }> };

export type CategorizedChatsQueryVariables = Exact<{
  type: QueryTypeInput;
}>;


export type CategorizedChatsQuery = { __typename?: 'Query', categorizedChats: Array<{ __typename?: 'Chat', id: string, chatType: EChatType, queryType: EqAtypes, messages: Array<{ __typename?: 'Message', message: string, sender?: string | null, createdDate: string }>, users?: Array<{ __typename?: 'User', id: string, lastName: string, firstName: string, avatar: string }> | null }> };

export type BroacastedMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type BroacastedMessagesQuery = { __typename?: 'Query', broadcastedMessages: Array<{ __typename?: 'Notification', id: string, content: string, createdDate: any, payload: { __typename?: 'NotificationPayload', title?: string | null } }> };

export type ChatEventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ChatEventSubscription = { __typename?: 'Subscription', chatEvent: { __typename?: 'Chat', id: string, chatType: EChatType, messages: Array<{ __typename?: 'Message', message: string, sender?: string | null, createdDate: string }>, users?: Array<{ __typename?: 'User', id: string, lastName: string, firstName: string }> | null } };

export type CreateCmsMutationVariables = Exact<{
  content: CreateCmsInput;
}>;


export type CreateCmsMutation = { __typename?: 'Mutation', createCms: { __typename?: 'Cms', id: string, name: string, category: EcmsTypes, description: string, qaType?: EqAtypes | null, thumbnail?: string | null, createdDate: any, updatedDate: any } };

export type UploadPdfFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadPdfFileMutation = { __typename?: 'Mutation', uploadPDFFile: string };

export type CmsStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type CmsStatsQuery = { __typename?: 'Query', cmsStats: { __typename?: 'AllStats', women: { __typename?: 'CmsStat', registered: number, categories: Array<{ __typename?: 'CatType', name: string, count: number }>, gender: Array<{ __typename?: 'GenderType', total: number, male: number, female: number, other: number, none: number }> }, youth: { __typename?: 'CmsStat', registered: number, categories: Array<{ __typename?: 'CatType', name: string, count: number }>, gender: Array<{ __typename?: 'GenderType', total: number, male: number, female: number, other: number, none: number }> }, business: { __typename?: 'CmsStat', registered: number, categories: Array<{ __typename?: 'CatType', name: string, count: number }>, gender: Array<{ __typename?: 'GenderType', total: number, male: number, female: number, other: number, none: number }> }, chogm: { __typename?: 'CmsStat', registered: number, categories: Array<{ __typename?: 'CatType', name: string, count: number }>, gender: Array<{ __typename?: 'GenderType', total: number, male: number, female: number, other: number, none: number }> }, people: { __typename?: 'CmsStat', registered: number, categories: Array<{ __typename?: 'CatType', name: string, count: number }>, gender: Array<{ __typename?: 'GenderType', total: number, male: number, female: number, other: number, none: number }> } } };

export type VerifyEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: boolean };

export type CreateForumMutationVariables = Exact<{
  forum: CreateForumInput;
}>;


export type CreateForumMutation = { __typename?: 'Mutation', createForum: { __typename?: 'Forum', id: string, name: string, description: string, status: boolean, startDate: any, endDate: any, attendees: Array<string>, thumbnail: string } };

export type UpdateForumMutationVariables = Exact<{
  forum: UpdateForumInput;
}>;


export type UpdateForumMutation = { __typename?: 'Mutation', updateForum: { __typename?: 'Forum', id: string, name: string, description: string, status: boolean, startDate: any, endDate: any, attendees: Array<string>, thumbnail: string } };

export type ForumsQueryVariables = Exact<{ [key: string]: never; }>;


export type ForumsQuery = { __typename?: 'Query', forums: Array<{ __typename?: 'Forum', id: string, name: string, description: string, status: boolean, startDate: any, endDate: any, attendees: Array<string>, thumbnail: string, state: boolean, venue: { __typename?: 'Venue', id: string, name: string }, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> }, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> }> };

export type ForumQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ForumQuery = { __typename?: 'Query', forum: { __typename?: 'Forum', id: string, name: string, description: string, status: boolean, startDate: any, endDate: any, attendees: Array<string>, thumbnail: string, venue: { __typename?: 'Venue', id: string, name: string }, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } } };

export type LoginMutationVariables = Exact<{
  payload: UserLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', UserLogin: { __typename?: 'UserToken', token: string, user: { __typename?: 'User', email: string, lastName: string, firstName: string, role: Array<EUserRole> } } };

export type CreateProgrammeMutationVariables = Exact<{
  program: CreateProgrammeInput;
}>;


export type CreateProgrammeMutation = { __typename?: 'Mutation', createProgramme: { __typename?: 'Programme', id: string, title: string, startDate: any, endDate: any, broadcastLink?: string | null, description: string } };

export type UpdateProgrammeMutationVariables = Exact<{
  program: UpdateProgrammeInput;
}>;


export type UpdateProgrammeMutation = { __typename?: 'Mutation', updateProgramme: { __typename?: 'Programme', id: string, title: string, startDate: any, endDate: any, broadcastLink?: string | null, description: string } };

export type ProgrammesQueryVariables = Exact<{ [key: string]: never; }>;


export type ProgrammesQuery = { __typename?: 'Query', programmes?: Array<{ __typename?: 'Programme', id: string, title: string, startDate: any, endDate: any, broadcastLink?: string | null, description: string, state: boolean, forum: { __typename?: 'Forum', id: string, name: string, startDate: any, endDate: any }, room?: { __typename?: 'Room', id: string, name: string, availability: boolean, venue: { __typename?: 'Venue', id: string, name: string } } | null, speakers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, moderator: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> }, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> }> | null };

export type ProgrammeQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProgrammeQuery = { __typename?: 'Query', programme: { __typename?: 'Programme', id: string, title: string, broadcastLink?: string | null, description: string, startDate: any, endDate: any, forum: { __typename?: 'Forum', id: string, name: string, startDate: any, endDate: any }, room?: { __typename?: 'Room', id: string, name: string, availability: boolean } | null, speakers: Array<{ __typename?: 'User', age?: number | null, avatar: string, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean }>, moderator: Array<{ __typename?: 'User', age?: number | null, avatar: string, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean }>, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } } };

export type UsersByRoleQueryVariables = Exact<{
  role: RolesInput;
}>;


export type UsersByRoleQuery = { __typename?: 'Query', usersByRole: Array<{ __typename?: 'User', age?: number | null, avatar: string, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, state: boolean }> };

export type UsersByIdsQueryVariables = Exact<{
  ids: UserIdsInput;
}>;


export type UsersByIdsQuery = { __typename?: 'Query', usersByIds: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> };

export type CreateRoomMutationVariables = Exact<{
  room: CreateRoomInput;
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, thumbnail: string, description: string, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, microphone: boolean, projector: boolean, wifi: boolean } } };

export type UpdateRoomMutationVariables = Exact<{
  room: UpdateRoomInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', updateRoom: { __typename?: 'Room', id: string, thumbnail: string, description: string, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, microphone: boolean, projector: boolean, wifi: boolean } } };

export type RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, name: string, isMediaRoom: boolean, availability: boolean, bookable: boolean, thumbnail: string, description: string, capacity: number, state: boolean, venue: { __typename?: 'Venue', id: string, name: string, shortDescription: string }, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, microphone: boolean, projector: boolean, wifi: boolean }, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> }> };

export type RoomQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type RoomQuery = { __typename?: 'Query', room: { __typename?: 'Room', id: string, name: string, isMediaRoom: boolean, availability: boolean, bookable: boolean, thumbnail: string, description: string, capacity: number, venue: { __typename?: 'Venue', id: string, name: string, shortDescription: string }, amenities: { __typename?: 'RoomAmenities', camera: boolean, conditioner: boolean, microphone: boolean, projector: boolean, wifi: boolean } } };

export type AvailableRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableRoomsQuery = { __typename?: 'Query', availableRooms: Array<{ __typename?: 'Room', id: string, name: string, availability: boolean, description: string, thumbnail: string }> };

export type AvailableRoomsByDateRangeQueryVariables = Exact<{
  range: DateRangeInput;
}>;


export type AvailableRoomsByDateRangeQuery = { __typename?: 'Query', availableRoomsDateRange: Array<{ __typename?: 'Room', id: string, name: string, availability: boolean, description: string, thumbnail: string }> };

export type UpdateCmsMutationVariables = Exact<{
  content: UpdateCmsInput;
}>;


export type UpdateCmsMutation = { __typename?: 'Mutation', updateCms: { __typename?: 'Cms', id: string, name: string, category: EcmsTypes, description: string, qaType?: EqAtypes | null, thumbnail?: string | null, createdDate: any, updatedDate: any } };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', age?: number | null, avatar: string, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, showNoc: boolean } };

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', age?: number | null, avatar: string, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, showNoc: boolean } };

export type UsersQueryVariables = Exact<{
  limit: Scalars['Float'];
  skip: Scalars['Float'];
}>;


export type UsersQuery = { __typename?: 'Query', usersCount: number, users: Array<{ __typename?: 'User', age?: number | null, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, avatar: string, state: boolean, showNoc: boolean, phoneNumber?: string | null, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } }> };

export type UserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', age?: number | null, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, avatar: string, state: boolean, showNoc: boolean, phoneNumber?: string | null, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } } };

export type UserSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type UserSearchQuery = { __typename?: 'Query', usersSearch: Array<{ __typename?: 'User', age?: number | null, biography: string, description: string, email: string, firstName: string, id: string, lastName: string, role: Array<EUserRole>, status: boolean, avatar: string, state: boolean, showNoc: boolean, phoneNumber?: string | null, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } }> };

export type CreateVenueMutationVariables = Exact<{
  venue: CreateVenueInput;
}>;


export type CreateVenueMutation = { __typename?: 'Mutation', createVenue: { __typename?: 'Venue', id: string, name: string, thumbnail: string, description: string, shortDescription: string, venueCategory: EVenueType } };

export type UpdateVenueMutationVariables = Exact<{
  venue: UpdateVenueInput;
}>;


export type UpdateVenueMutation = { __typename?: 'Mutation', updateVenue: { __typename?: 'Venue', id: string, name: string, thumbnail: string, description: string, shortDescription: string, venueCategory: EVenueType } };

export type VenuesQueryVariables = Exact<{ [key: string]: never; }>;


export type VenuesQuery = { __typename?: 'Query', venues: Array<{ __typename?: 'Venue', id: string, name: string, thumbnail: string, shortDescription: string, description: string, venueCategory: EVenueType, state: boolean, venueInfo: { __typename?: 'VenueInfo', contactEmail?: string | null, contactPhone?: string | null, locationLink: string, venueLocationName?: string | null, venueStreetAddress?: string | null, venueWebsite?: string | null, hotelRanking?: number | null }, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> }, createdBy: { __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }, updatedBy: Array<{ __typename?: 'CreatedBy', date: string, user?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null }> }> };

export type VenueQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type VenueQuery = { __typename?: 'Query', venue: { __typename?: 'Venue', id: string, name: string, thumbnail: string, shortDescription: string, description: string, venueCategory: EVenueType, venueInfo: { __typename?: 'VenueInfo', contactEmail?: string | null, contactPhone?: string | null, locationLink: string, venueLocationName?: string | null, venueStreetAddress?: string | null, venueWebsite?: string | null, hotelRanking?: number | null }, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } } };

export type VenuesByCategoryQueryVariables = Exact<{
  type: VenueCategoryInput;
}>;


export type VenuesByCategoryQuery = { __typename?: 'Query', venuesByCategoy: Array<{ __typename?: 'Venue', id: string, name: string, thumbnail: string, shortDescription: string, description: string, venueCategory: EVenueType, venueInfo: { __typename?: 'VenueInfo', contactEmail?: string | null, contactPhone?: string | null, locationLink: string, venueLocationName?: string | null, venueStreetAddress?: string | null, venueWebsite?: string | null, hotelRanking?: number | null }, rating: { __typename?: 'Rate', rate: number, rating: Array<{ __typename?: 'Rating', comment: string, createdDate: string, stars: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, avatar: string, role: Array<EUserRole> } }> } }> };

export type TakenRanksQueryVariables = Exact<{
  type: VenueCategoryInput;
}>;


export type TakenRanksQuery = { __typename?: 'Query', takenRanks: Array<number> };


export const UpdateNotificationDocument = gql`
    mutation updateNotification($ids: UpdateSeenNotificationInput!) {
  updateNotification(UpdateSeenNotificationInput: $ids)
}
    `;
export type UpdateNotificationMutationFn = Apollo.MutationFunction<UpdateNotificationMutation, UpdateNotificationMutationVariables>;

/**
 * __useUpdateNotificationMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationMutation, { data, loading, error }] = useUpdateNotificationMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useUpdateNotificationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationMutation, UpdateNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNotificationMutation, UpdateNotificationMutationVariables>(UpdateNotificationDocument, options);
      }
export type UpdateNotificationMutationHookResult = ReturnType<typeof useUpdateNotificationMutation>;
export type UpdateNotificationMutationResult = Apollo.MutationResult<UpdateNotificationMutation>;
export type UpdateNotificationMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationMutation, UpdateNotificationMutationVariables>;
export const NotificationsDocument = gql`
    query Notifications {
  notifications {
    content
    id
    type
    seen
    payload {
      payloadId
      from {
        id
        avatar
        firstName
        lastName
      }
    }
    createdDate
  }
}
    `;

/**
 * __useNotificationsQuery__
 *
 * To run a query within a React component, call `useNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
      }
export function useNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
        }
export type NotificationsQueryHookResult = ReturnType<typeof useNotificationsQuery>;
export type NotificationsLazyQueryHookResult = ReturnType<typeof useNotificationsLazyQuery>;
export type NotificationsQueryResult = Apollo.QueryResult<NotificationsQuery, NotificationsQueryVariables>;
export const NotificationEventDocument = gql`
    subscription NotificationEvent {
  notificationEvent {
    content
    id
    type
    userId
    payload {
      payloadId
    }
    seen
    createdDate
  }
}
    `;

/**
 * __useNotificationEventSubscription__
 *
 * To run a query within a React component, call `useNotificationEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationEventSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationEventSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNotificationEventSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NotificationEventSubscription, NotificationEventSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NotificationEventSubscription, NotificationEventSubscriptionVariables>(NotificationEventDocument, options);
      }
export type NotificationEventSubscriptionHookResult = ReturnType<typeof useNotificationEventSubscription>;
export type NotificationEventSubscriptionResult = Apollo.SubscriptionResult<NotificationEventSubscription>;
export const UploadFileDocument = gql`
    mutation uploadFile($file: Upload!) {
  uploadFile(file: $file)
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const CmsByCategoryDocument = gql`
    query cmsByCategory($category: CmsCategoryInput!) {
  cmsByCategory(CmsCategoryInput: $category) {
    id
    name
    category
    description
    qaType
    thumbnail
    createdDate
    updatedDate
    otherInfo {
      contactEmail
      contactPhone
      website
      pdfFile
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useCmsByCategoryQuery__
 *
 * To run a query within a React component, call `useCmsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsByCategoryQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useCmsByCategoryQuery(baseOptions: Apollo.QueryHookOptions<CmsByCategoryQuery, CmsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsByCategoryQuery, CmsByCategoryQueryVariables>(CmsByCategoryDocument, options);
      }
export function useCmsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsByCategoryQuery, CmsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsByCategoryQuery, CmsByCategoryQueryVariables>(CmsByCategoryDocument, options);
        }
export type CmsByCategoryQueryHookResult = ReturnType<typeof useCmsByCategoryQuery>;
export type CmsByCategoryLazyQueryHookResult = ReturnType<typeof useCmsByCategoryLazyQuery>;
export type CmsByCategoryQueryResult = Apollo.QueryResult<CmsByCategoryQuery, CmsByCategoryQueryVariables>;
export const CmsDocument = gql`
    query cms($id: String!) {
  cms(id: $id) {
    id
    name
    category
    description
    qaType
    thumbnail
    createdDate
    updatedDate
    otherInfo {
      contactEmail
      contactPhone
      website
      pdfFile
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useCmsQuery__
 *
 * To run a query within a React component, call `useCmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCmsQuery(baseOptions: Apollo.QueryHookOptions<CmsQuery, CmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsQuery, CmsQueryVariables>(CmsDocument, options);
      }
export function useCmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsQuery, CmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsQuery, CmsQueryVariables>(CmsDocument, options);
        }
export type CmsQueryHookResult = ReturnType<typeof useCmsQuery>;
export type CmsLazyQueryHookResult = ReturnType<typeof useCmsLazyQuery>;
export type CmsQueryResult = Apollo.QueryResult<CmsQuery, CmsQueryVariables>;
export const ApproveBookingDocument = gql`
    mutation approveBooking($booking: ApproveBookingInput!) {
  approveBooking(ApproveBookingInput: $booking) {
    id
    startDate
    endDate
    status
    message
  }
}
    `;
export type ApproveBookingMutationFn = Apollo.MutationFunction<ApproveBookingMutation, ApproveBookingMutationVariables>;

/**
 * __useApproveBookingMutation__
 *
 * To run a mutation, you first call `useApproveBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveBookingMutation, { data, loading, error }] = useApproveBookingMutation({
 *   variables: {
 *      booking: // value for 'booking'
 *   },
 * });
 */
export function useApproveBookingMutation(baseOptions?: Apollo.MutationHookOptions<ApproveBookingMutation, ApproveBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveBookingMutation, ApproveBookingMutationVariables>(ApproveBookingDocument, options);
      }
export type ApproveBookingMutationHookResult = ReturnType<typeof useApproveBookingMutation>;
export type ApproveBookingMutationResult = Apollo.MutationResult<ApproveBookingMutation>;
export type ApproveBookingMutationOptions = Apollo.BaseMutationOptions<ApproveBookingMutation, ApproveBookingMutationVariables>;
export const BookingsDocument = gql`
    query bookings {
  bookings {
    id
    room {
      id
      name
      amenities {
        camera
        conditioner
        projector
        microphone
        wifi
      }
      thumbnail
      availability
      venue {
        id
        name
      }
    }
    startDate
    endDate
    status
    user {
      id
      firstName
      lastName
      avatar
      role
    }
    createdDate
  }
}
    `;

/**
 * __useBookingsQuery__
 *
 * To run a query within a React component, call `useBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useBookingsQuery(baseOptions?: Apollo.QueryHookOptions<BookingsQuery, BookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookingsQuery, BookingsQueryVariables>(BookingsDocument, options);
      }
export function useBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookingsQuery, BookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookingsQuery, BookingsQueryVariables>(BookingsDocument, options);
        }
export type BookingsQueryHookResult = ReturnType<typeof useBookingsQuery>;
export type BookingsLazyQueryHookResult = ReturnType<typeof useBookingsLazyQuery>;
export type BookingsQueryResult = Apollo.QueryResult<BookingsQuery, BookingsQueryVariables>;
export const BookingRequestDocument = gql`
    subscription bookingRequest {
  bookingRequestEvent {
    id
    room {
      id
      name
      amenities {
        camera
        conditioner
        projector
        microphone
        wifi
      }
      thumbnail
      availability
      venue {
        id
        name
      }
    }
    startDate
    endDate
    status
    user {
      id
      firstName
      lastName
      avatar
      role
    }
  }
}
    `;

/**
 * __useBookingRequestSubscription__
 *
 * To run a query within a React component, call `useBookingRequestSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBookingRequestSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingRequestSubscription({
 *   variables: {
 *   },
 * });
 */
export function useBookingRequestSubscription(baseOptions?: Apollo.SubscriptionHookOptions<BookingRequestSubscription, BookingRequestSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BookingRequestSubscription, BookingRequestSubscriptionVariables>(BookingRequestDocument, options);
      }
export type BookingRequestSubscriptionHookResult = ReturnType<typeof useBookingRequestSubscription>;
export type BookingRequestSubscriptionResult = Apollo.SubscriptionResult<BookingRequestSubscription>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($newPassword: String!, $verificationCode: Float!) {
  resetPassword(newPassword: $newPassword, verificationCode: $verificationCode)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      verificationCode: // value for 'verificationCode'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendNewChatDocument = gql`
    mutation sendNewChat($chat: CreateChatInput!) {
  sendNewChat(createChatInput: $chat) {
    chatType
    id
    createdDate
  }
}
    `;
export type SendNewChatMutationFn = Apollo.MutationFunction<SendNewChatMutation, SendNewChatMutationVariables>;

/**
 * __useSendNewChatMutation__
 *
 * To run a mutation, you first call `useSendNewChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNewChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNewChatMutation, { data, loading, error }] = useSendNewChatMutation({
 *   variables: {
 *      chat: // value for 'chat'
 *   },
 * });
 */
export function useSendNewChatMutation(baseOptions?: Apollo.MutationHookOptions<SendNewChatMutation, SendNewChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNewChatMutation, SendNewChatMutationVariables>(SendNewChatDocument, options);
      }
export type SendNewChatMutationHookResult = ReturnType<typeof useSendNewChatMutation>;
export type SendNewChatMutationResult = Apollo.MutationResult<SendNewChatMutation>;
export type SendNewChatMutationOptions = Apollo.BaseMutationOptions<SendNewChatMutation, SendNewChatMutationVariables>;
export const ReplyChatDocument = gql`
    mutation replyChat($reply: ReplyChatInput!) {
  replyChat(ReplyChatInput: $reply) {
    createdDate
    messages {
      createdDate
      message
      sender
    }
  }
}
    `;
export type ReplyChatMutationFn = Apollo.MutationFunction<ReplyChatMutation, ReplyChatMutationVariables>;

/**
 * __useReplyChatMutation__
 *
 * To run a mutation, you first call `useReplyChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReplyChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [replyChatMutation, { data, loading, error }] = useReplyChatMutation({
 *   variables: {
 *      reply: // value for 'reply'
 *   },
 * });
 */
export function useReplyChatMutation(baseOptions?: Apollo.MutationHookOptions<ReplyChatMutation, ReplyChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReplyChatMutation, ReplyChatMutationVariables>(ReplyChatDocument, options);
      }
export type ReplyChatMutationHookResult = ReturnType<typeof useReplyChatMutation>;
export type ReplyChatMutationResult = Apollo.MutationResult<ReplyChatMutation>;
export type ReplyChatMutationOptions = Apollo.BaseMutationOptions<ReplyChatMutation, ReplyChatMutationVariables>;
export const BroadcastMessageDocument = gql`
    mutation broadcastMessage($message: String!, $title: String!) {
  BroadcastMessage(message: $message, title: $title)
}
    `;
export type BroadcastMessageMutationFn = Apollo.MutationFunction<BroadcastMessageMutation, BroadcastMessageMutationVariables>;

/**
 * __useBroadcastMessageMutation__
 *
 * To run a mutation, you first call `useBroadcastMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBroadcastMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [broadcastMessageMutation, { data, loading, error }] = useBroadcastMessageMutation({
 *   variables: {
 *      message: // value for 'message'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useBroadcastMessageMutation(baseOptions?: Apollo.MutationHookOptions<BroadcastMessageMutation, BroadcastMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BroadcastMessageMutation, BroadcastMessageMutationVariables>(BroadcastMessageDocument, options);
      }
export type BroadcastMessageMutationHookResult = ReturnType<typeof useBroadcastMessageMutation>;
export type BroadcastMessageMutationResult = Apollo.MutationResult<BroadcastMessageMutation>;
export type BroadcastMessageMutationOptions = Apollo.BaseMutationOptions<BroadcastMessageMutation, BroadcastMessageMutationVariables>;
export const GetChatsDocument = gql`
    query getChats($id: String!) {
  chats(userId: $id) {
    id
    queryType
    chatType
    messages {
      message
      sender
      createdDate
    }
    users {
      id
      lastName
      firstName
      avatar
    }
  }
}
    `;

/**
 * __useGetChatsQuery__
 *
 * To run a query within a React component, call `useGetChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChatsQuery(baseOptions: Apollo.QueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
      }
export function useGetChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatsQuery, GetChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatsQuery, GetChatsQueryVariables>(GetChatsDocument, options);
        }
export type GetChatsQueryHookResult = ReturnType<typeof useGetChatsQuery>;
export type GetChatsLazyQueryHookResult = ReturnType<typeof useGetChatsLazyQuery>;
export type GetChatsQueryResult = Apollo.QueryResult<GetChatsQuery, GetChatsQueryVariables>;
export const GetChatsByNocDocument = gql`
    query getChatsByNOC {
  chatsByNOC {
    id
    chatType
    queryType
    createdDate
    messages {
      message
      sender
      createdDate
    }
    users {
      id
      lastName
      firstName
      avatar
    }
  }
}
    `;

/**
 * __useGetChatsByNocQuery__
 *
 * To run a query within a React component, call `useGetChatsByNocQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatsByNocQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatsByNocQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChatsByNocQuery(baseOptions?: Apollo.QueryHookOptions<GetChatsByNocQuery, GetChatsByNocQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatsByNocQuery, GetChatsByNocQueryVariables>(GetChatsByNocDocument, options);
      }
export function useGetChatsByNocLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatsByNocQuery, GetChatsByNocQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatsByNocQuery, GetChatsByNocQueryVariables>(GetChatsByNocDocument, options);
        }
export type GetChatsByNocQueryHookResult = ReturnType<typeof useGetChatsByNocQuery>;
export type GetChatsByNocLazyQueryHookResult = ReturnType<typeof useGetChatsByNocLazyQuery>;
export type GetChatsByNocQueryResult = Apollo.QueryResult<GetChatsByNocQuery, GetChatsByNocQueryVariables>;
export const CategorizedChatsDocument = gql`
    query categorizedChats($type: queryTypeInput!) {
  categorizedChats(queryTypeInput: $type) {
    id
    chatType
    queryType
    messages {
      message
      sender
      createdDate
    }
    users {
      id
      lastName
      firstName
      avatar
    }
  }
}
    `;

/**
 * __useCategorizedChatsQuery__
 *
 * To run a query within a React component, call `useCategorizedChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategorizedChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategorizedChatsQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCategorizedChatsQuery(baseOptions: Apollo.QueryHookOptions<CategorizedChatsQuery, CategorizedChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategorizedChatsQuery, CategorizedChatsQueryVariables>(CategorizedChatsDocument, options);
      }
export function useCategorizedChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategorizedChatsQuery, CategorizedChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategorizedChatsQuery, CategorizedChatsQueryVariables>(CategorizedChatsDocument, options);
        }
export type CategorizedChatsQueryHookResult = ReturnType<typeof useCategorizedChatsQuery>;
export type CategorizedChatsLazyQueryHookResult = ReturnType<typeof useCategorizedChatsLazyQuery>;
export type CategorizedChatsQueryResult = Apollo.QueryResult<CategorizedChatsQuery, CategorizedChatsQueryVariables>;
export const BroacastedMessagesDocument = gql`
    query broacastedMessages {
  broadcastedMessages {
    id
    content
    payload {
      title
    }
    createdDate
  }
}
    `;

/**
 * __useBroacastedMessagesQuery__
 *
 * To run a query within a React component, call `useBroacastedMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBroacastedMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBroacastedMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useBroacastedMessagesQuery(baseOptions?: Apollo.QueryHookOptions<BroacastedMessagesQuery, BroacastedMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BroacastedMessagesQuery, BroacastedMessagesQueryVariables>(BroacastedMessagesDocument, options);
      }
export function useBroacastedMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BroacastedMessagesQuery, BroacastedMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BroacastedMessagesQuery, BroacastedMessagesQueryVariables>(BroacastedMessagesDocument, options);
        }
export type BroacastedMessagesQueryHookResult = ReturnType<typeof useBroacastedMessagesQuery>;
export type BroacastedMessagesLazyQueryHookResult = ReturnType<typeof useBroacastedMessagesLazyQuery>;
export type BroacastedMessagesQueryResult = Apollo.QueryResult<BroacastedMessagesQuery, BroacastedMessagesQueryVariables>;
export const ChatEventDocument = gql`
    subscription ChatEvent {
  chatEvent {
    id
    chatType
    messages {
      message
      sender
      createdDate
    }
    users {
      id
      lastName
      firstName
    }
  }
}
    `;

/**
 * __useChatEventSubscription__
 *
 * To run a query within a React component, call `useChatEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatEventSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatEventSubscription({
 *   variables: {
 *   },
 * });
 */
export function useChatEventSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ChatEventSubscription, ChatEventSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatEventSubscription, ChatEventSubscriptionVariables>(ChatEventDocument, options);
      }
export type ChatEventSubscriptionHookResult = ReturnType<typeof useChatEventSubscription>;
export type ChatEventSubscriptionResult = Apollo.SubscriptionResult<ChatEventSubscription>;
export const CreateCmsDocument = gql`
    mutation createCMS($content: CreateCmsInput!) {
  createCms(CreateCmsInput: $content) {
    id
    name
    category
    description
    qaType
    thumbnail
    createdDate
    updatedDate
  }
}
    `;
export type CreateCmsMutationFn = Apollo.MutationFunction<CreateCmsMutation, CreateCmsMutationVariables>;

/**
 * __useCreateCmsMutation__
 *
 * To run a mutation, you first call `useCreateCmsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCmsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCmsMutation, { data, loading, error }] = useCreateCmsMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateCmsMutation(baseOptions?: Apollo.MutationHookOptions<CreateCmsMutation, CreateCmsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCmsMutation, CreateCmsMutationVariables>(CreateCmsDocument, options);
      }
export type CreateCmsMutationHookResult = ReturnType<typeof useCreateCmsMutation>;
export type CreateCmsMutationResult = Apollo.MutationResult<CreateCmsMutation>;
export type CreateCmsMutationOptions = Apollo.BaseMutationOptions<CreateCmsMutation, CreateCmsMutationVariables>;
export const UploadPdfFileDocument = gql`
    mutation uploadPDFFile($file: Upload!) {
  uploadPDFFile(file: $file)
}
    `;
export type UploadPdfFileMutationFn = Apollo.MutationFunction<UploadPdfFileMutation, UploadPdfFileMutationVariables>;

/**
 * __useUploadPdfFileMutation__
 *
 * To run a mutation, you first call `useUploadPdfFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadPdfFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadPdfFileMutation, { data, loading, error }] = useUploadPdfFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadPdfFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadPdfFileMutation, UploadPdfFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadPdfFileMutation, UploadPdfFileMutationVariables>(UploadPdfFileDocument, options);
      }
export type UploadPdfFileMutationHookResult = ReturnType<typeof useUploadPdfFileMutation>;
export type UploadPdfFileMutationResult = Apollo.MutationResult<UploadPdfFileMutation>;
export type UploadPdfFileMutationOptions = Apollo.BaseMutationOptions<UploadPdfFileMutation, UploadPdfFileMutationVariables>;
export const CmsStatsDocument = gql`
    query cmsStats {
  cmsStats {
    women {
      registered
      categories {
        name
        count
      }
      gender {
        total
        male
        female
        other
        none
      }
    }
    youth {
      registered
      categories {
        name
        count
      }
      gender {
        total
        male
        female
        other
        none
      }
    }
    business {
      registered
      categories {
        name
        count
      }
      gender {
        total
        male
        female
        other
        none
      }
    }
    chogm {
      registered
      categories {
        name
        count
      }
      gender {
        total
        male
        female
        other
        none
      }
    }
    people {
      registered
      categories {
        name
        count
      }
      gender {
        total
        male
        female
        other
        none
      }
    }
  }
}
    `;

/**
 * __useCmsStatsQuery__
 *
 * To run a query within a React component, call `useCmsStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsStatsQuery(baseOptions?: Apollo.QueryHookOptions<CmsStatsQuery, CmsStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsStatsQuery, CmsStatsQueryVariables>(CmsStatsDocument, options);
      }
export function useCmsStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsStatsQuery, CmsStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsStatsQuery, CmsStatsQueryVariables>(CmsStatsDocument, options);
        }
export type CmsStatsQueryHookResult = ReturnType<typeof useCmsStatsQuery>;
export type CmsStatsLazyQueryHookResult = ReturnType<typeof useCmsStatsLazyQuery>;
export type CmsStatsQueryResult = Apollo.QueryResult<CmsStatsQuery, CmsStatsQueryVariables>;
export const VerifyEmailDocument = gql`
    mutation verifyEmail($email: String!) {
  verifyEmail(email: $email)
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const CreateForumDocument = gql`
    mutation createForum($forum: CreateForumInput!) {
  createForum(createForumInput: $forum) {
    id
    name
    description
    status
    startDate
    endDate
    attendees
    thumbnail
  }
}
    `;
export type CreateForumMutationFn = Apollo.MutationFunction<CreateForumMutation, CreateForumMutationVariables>;

/**
 * __useCreateForumMutation__
 *
 * To run a mutation, you first call `useCreateForumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateForumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createForumMutation, { data, loading, error }] = useCreateForumMutation({
 *   variables: {
 *      forum: // value for 'forum'
 *   },
 * });
 */
export function useCreateForumMutation(baseOptions?: Apollo.MutationHookOptions<CreateForumMutation, CreateForumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateForumMutation, CreateForumMutationVariables>(CreateForumDocument, options);
      }
export type CreateForumMutationHookResult = ReturnType<typeof useCreateForumMutation>;
export type CreateForumMutationResult = Apollo.MutationResult<CreateForumMutation>;
export type CreateForumMutationOptions = Apollo.BaseMutationOptions<CreateForumMutation, CreateForumMutationVariables>;
export const UpdateForumDocument = gql`
    mutation updateForum($forum: UpdateForumInput!) {
  updateForum(createForumInput: $forum) {
    id
    name
    description
    status
    startDate
    endDate
    attendees
    thumbnail
  }
}
    `;
export type UpdateForumMutationFn = Apollo.MutationFunction<UpdateForumMutation, UpdateForumMutationVariables>;

/**
 * __useUpdateForumMutation__
 *
 * To run a mutation, you first call `useUpdateForumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateForumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateForumMutation, { data, loading, error }] = useUpdateForumMutation({
 *   variables: {
 *      forum: // value for 'forum'
 *   },
 * });
 */
export function useUpdateForumMutation(baseOptions?: Apollo.MutationHookOptions<UpdateForumMutation, UpdateForumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateForumMutation, UpdateForumMutationVariables>(UpdateForumDocument, options);
      }
export type UpdateForumMutationHookResult = ReturnType<typeof useUpdateForumMutation>;
export type UpdateForumMutationResult = Apollo.MutationResult<UpdateForumMutation>;
export type UpdateForumMutationOptions = Apollo.BaseMutationOptions<UpdateForumMutation, UpdateForumMutationVariables>;
export const ForumsDocument = gql`
    query Forums {
  forums {
    id
    name
    description
    status
    startDate
    endDate
    attendees
    thumbnail
    venue {
      id
      name
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useForumsQuery__
 *
 * To run a query within a React component, call `useForumsQuery` and pass it any options that fit your needs.
 * When your component renders, `useForumsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useForumsQuery({
 *   variables: {
 *   },
 * });
 */
export function useForumsQuery(baseOptions?: Apollo.QueryHookOptions<ForumsQuery, ForumsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ForumsQuery, ForumsQueryVariables>(ForumsDocument, options);
      }
export function useForumsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ForumsQuery, ForumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ForumsQuery, ForumsQueryVariables>(ForumsDocument, options);
        }
export type ForumsQueryHookResult = ReturnType<typeof useForumsQuery>;
export type ForumsLazyQueryHookResult = ReturnType<typeof useForumsLazyQuery>;
export type ForumsQueryResult = Apollo.QueryResult<ForumsQuery, ForumsQueryVariables>;
export const ForumDocument = gql`
    query Forum($id: String!) {
  forum(id: $id) {
    id
    name
    description
    status
    startDate
    endDate
    attendees
    thumbnail
    venue {
      id
      name
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useForumQuery__
 *
 * To run a query within a React component, call `useForumQuery` and pass it any options that fit your needs.
 * When your component renders, `useForumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useForumQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useForumQuery(baseOptions: Apollo.QueryHookOptions<ForumQuery, ForumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ForumQuery, ForumQueryVariables>(ForumDocument, options);
      }
export function useForumLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ForumQuery, ForumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ForumQuery, ForumQueryVariables>(ForumDocument, options);
        }
export type ForumQueryHookResult = ReturnType<typeof useForumQuery>;
export type ForumLazyQueryHookResult = ReturnType<typeof useForumLazyQuery>;
export type ForumQueryResult = Apollo.QueryResult<ForumQuery, ForumQueryVariables>;
export const LoginDocument = gql`
    mutation Login($payload: UserLoginInput!) {
  UserLogin(UserLoginInput: $payload) {
    user {
      email
      lastName
      firstName
      role
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      payload: // value for 'payload'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CreateProgrammeDocument = gql`
    mutation createProgramme($program: CreateProgrammeInput!) {
  createProgramme(createProgrammeInput: $program) {
    id
    title
    startDate
    endDate
    broadcastLink
    description
  }
}
    `;
export type CreateProgrammeMutationFn = Apollo.MutationFunction<CreateProgrammeMutation, CreateProgrammeMutationVariables>;

/**
 * __useCreateProgrammeMutation__
 *
 * To run a mutation, you first call `useCreateProgrammeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProgrammeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProgrammeMutation, { data, loading, error }] = useCreateProgrammeMutation({
 *   variables: {
 *      program: // value for 'program'
 *   },
 * });
 */
export function useCreateProgrammeMutation(baseOptions?: Apollo.MutationHookOptions<CreateProgrammeMutation, CreateProgrammeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProgrammeMutation, CreateProgrammeMutationVariables>(CreateProgrammeDocument, options);
      }
export type CreateProgrammeMutationHookResult = ReturnType<typeof useCreateProgrammeMutation>;
export type CreateProgrammeMutationResult = Apollo.MutationResult<CreateProgrammeMutation>;
export type CreateProgrammeMutationOptions = Apollo.BaseMutationOptions<CreateProgrammeMutation, CreateProgrammeMutationVariables>;
export const UpdateProgrammeDocument = gql`
    mutation updateProgramme($program: UpdateProgrammeInput!) {
  updateProgramme(UpdateProgrammeInput: $program) {
    id
    title
    startDate
    endDate
    broadcastLink
    description
  }
}
    `;
export type UpdateProgrammeMutationFn = Apollo.MutationFunction<UpdateProgrammeMutation, UpdateProgrammeMutationVariables>;

/**
 * __useUpdateProgrammeMutation__
 *
 * To run a mutation, you first call `useUpdateProgrammeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProgrammeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProgrammeMutation, { data, loading, error }] = useUpdateProgrammeMutation({
 *   variables: {
 *      program: // value for 'program'
 *   },
 * });
 */
export function useUpdateProgrammeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProgrammeMutation, UpdateProgrammeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProgrammeMutation, UpdateProgrammeMutationVariables>(UpdateProgrammeDocument, options);
      }
export type UpdateProgrammeMutationHookResult = ReturnType<typeof useUpdateProgrammeMutation>;
export type UpdateProgrammeMutationResult = Apollo.MutationResult<UpdateProgrammeMutation>;
export type UpdateProgrammeMutationOptions = Apollo.BaseMutationOptions<UpdateProgrammeMutation, UpdateProgrammeMutationVariables>;
export const ProgrammesDocument = gql`
    query Programmes {
  programmes {
    id
    title
    startDate
    endDate
    broadcastLink
    description
    forum {
      id
      name
      startDate
      endDate
    }
    room {
      id
      name
      availability
      venue {
        id
        name
      }
    }
    speakers {
      id
      firstName
      lastName
    }
    moderator {
      id
      firstName
      lastName
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useProgrammesQuery__
 *
 * To run a query within a React component, call `useProgrammesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgrammesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgrammesQuery({
 *   variables: {
 *   },
 * });
 */
export function useProgrammesQuery(baseOptions?: Apollo.QueryHookOptions<ProgrammesQuery, ProgrammesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgrammesQuery, ProgrammesQueryVariables>(ProgrammesDocument, options);
      }
export function useProgrammesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgrammesQuery, ProgrammesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgrammesQuery, ProgrammesQueryVariables>(ProgrammesDocument, options);
        }
export type ProgrammesQueryHookResult = ReturnType<typeof useProgrammesQuery>;
export type ProgrammesLazyQueryHookResult = ReturnType<typeof useProgrammesLazyQuery>;
export type ProgrammesQueryResult = Apollo.QueryResult<ProgrammesQuery, ProgrammesQueryVariables>;
export const ProgrammeDocument = gql`
    query Programme($id: String!) {
  programme(id: $id) {
    id
    title
    broadcastLink
    description
    startDate
    endDate
    forum {
      id
      name
      startDate
      endDate
    }
    room {
      id
      name
      availability
    }
    speakers {
      age
      avatar
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
    }
    moderator {
      age
      avatar
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useProgrammeQuery__
 *
 * To run a query within a React component, call `useProgrammeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgrammeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgrammeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgrammeQuery(baseOptions: Apollo.QueryHookOptions<ProgrammeQuery, ProgrammeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgrammeQuery, ProgrammeQueryVariables>(ProgrammeDocument, options);
      }
export function useProgrammeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgrammeQuery, ProgrammeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgrammeQuery, ProgrammeQueryVariables>(ProgrammeDocument, options);
        }
export type ProgrammeQueryHookResult = ReturnType<typeof useProgrammeQuery>;
export type ProgrammeLazyQueryHookResult = ReturnType<typeof useProgrammeLazyQuery>;
export type ProgrammeQueryResult = Apollo.QueryResult<ProgrammeQuery, ProgrammeQueryVariables>;
export const UsersByRoleDocument = gql`
    query UsersByRole($role: RolesInput!) {
  usersByRole(RoleInput: $role) {
    age
    avatar
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    state
  }
}
    `;

/**
 * __useUsersByRoleQuery__
 *
 * To run a query within a React component, call `useUsersByRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersByRoleQuery({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUsersByRoleQuery(baseOptions: Apollo.QueryHookOptions<UsersByRoleQuery, UsersByRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, options);
      }
export function useUsersByRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersByRoleQuery, UsersByRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, options);
        }
export type UsersByRoleQueryHookResult = ReturnType<typeof useUsersByRoleQuery>;
export type UsersByRoleLazyQueryHookResult = ReturnType<typeof useUsersByRoleLazyQuery>;
export type UsersByRoleQueryResult = Apollo.QueryResult<UsersByRoleQuery, UsersByRoleQueryVariables>;
export const UsersByIdsDocument = gql`
    query UsersByIds($ids: UserIdsInput!) {
  usersByIds(UserIdsInput: $ids) {
    id
    firstName
    lastName
  }
}
    `;

/**
 * __useUsersByIdsQuery__
 *
 * To run a query within a React component, call `useUsersByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersByIdsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useUsersByIdsQuery(baseOptions: Apollo.QueryHookOptions<UsersByIdsQuery, UsersByIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersByIdsQuery, UsersByIdsQueryVariables>(UsersByIdsDocument, options);
      }
export function useUsersByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersByIdsQuery, UsersByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersByIdsQuery, UsersByIdsQueryVariables>(UsersByIdsDocument, options);
        }
export type UsersByIdsQueryHookResult = ReturnType<typeof useUsersByIdsQuery>;
export type UsersByIdsLazyQueryHookResult = ReturnType<typeof useUsersByIdsLazyQuery>;
export type UsersByIdsQueryResult = Apollo.QueryResult<UsersByIdsQuery, UsersByIdsQueryVariables>;
export const CreateRoomDocument = gql`
    mutation createRoom($room: CreateRoomInput!) {
  createRoom(createRoomInput: $room) {
    id
    thumbnail
    description
    amenities {
      camera
      conditioner
      microphone
      projector
      wifi
    }
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      room: // value for 'room'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const UpdateRoomDocument = gql`
    mutation updateRoom($room: UpdateRoomInput!) {
  updateRoom(UpdateRoomInput: $room) {
    id
    thumbnail
    description
    amenities {
      camera
      conditioner
      microphone
      projector
      wifi
    }
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutation, UpdateRoomMutationVariables>;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoomMutation, { data, loading, error }] = useUpdateRoomMutation({
 *   variables: {
 *      room: // value for 'room'
 *   },
 * });
 */
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutation, UpdateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, options);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutation>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const RoomsDocument = gql`
    query Rooms {
  rooms {
    id
    name
    isMediaRoom
    availability
    bookable
    thumbnail
    description
    capacity
    venue {
      id
      name
      shortDescription
    }
    amenities {
      camera
      conditioner
      microphone
      projector
      wifi
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useRoomsQuery__
 *
 * To run a query within a React component, call `useRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoomsQuery(baseOptions?: Apollo.QueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
      }
export function useRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
        }
export type RoomsQueryHookResult = ReturnType<typeof useRoomsQuery>;
export type RoomsLazyQueryHookResult = ReturnType<typeof useRoomsLazyQuery>;
export type RoomsQueryResult = Apollo.QueryResult<RoomsQuery, RoomsQueryVariables>;
export const RoomDocument = gql`
    query Room($id: String!) {
  room(id: $id) {
    id
    name
    isMediaRoom
    availability
    bookable
    thumbnail
    description
    capacity
    venue {
      id
      name
      shortDescription
    }
    amenities {
      camera
      conditioner
      microphone
      projector
      wifi
    }
  }
}
    `;

/**
 * __useRoomQuery__
 *
 * To run a query within a React component, call `useRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRoomQuery(baseOptions: Apollo.QueryHookOptions<RoomQuery, RoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoomQuery, RoomQueryVariables>(RoomDocument, options);
      }
export function useRoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomQuery, RoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoomQuery, RoomQueryVariables>(RoomDocument, options);
        }
export type RoomQueryHookResult = ReturnType<typeof useRoomQuery>;
export type RoomLazyQueryHookResult = ReturnType<typeof useRoomLazyQuery>;
export type RoomQueryResult = Apollo.QueryResult<RoomQuery, RoomQueryVariables>;
export const AvailableRoomsDocument = gql`
    query availableRooms {
  availableRooms {
    id
    name
    availability
    description
    thumbnail
  }
}
    `;

/**
 * __useAvailableRoomsQuery__
 *
 * To run a query within a React component, call `useAvailableRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableRoomsQuery(baseOptions?: Apollo.QueryHookOptions<AvailableRoomsQuery, AvailableRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableRoomsQuery, AvailableRoomsQueryVariables>(AvailableRoomsDocument, options);
      }
export function useAvailableRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableRoomsQuery, AvailableRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableRoomsQuery, AvailableRoomsQueryVariables>(AvailableRoomsDocument, options);
        }
export type AvailableRoomsQueryHookResult = ReturnType<typeof useAvailableRoomsQuery>;
export type AvailableRoomsLazyQueryHookResult = ReturnType<typeof useAvailableRoomsLazyQuery>;
export type AvailableRoomsQueryResult = Apollo.QueryResult<AvailableRoomsQuery, AvailableRoomsQueryVariables>;
export const AvailableRoomsByDateRangeDocument = gql`
    query availableRoomsByDateRange($range: DateRangeInput!) {
  availableRoomsDateRange(dateRangeInput: $range) {
    id
    name
    availability
    description
    thumbnail
  }
}
    `;

/**
 * __useAvailableRoomsByDateRangeQuery__
 *
 * To run a query within a React component, call `useAvailableRoomsByDateRangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableRoomsByDateRangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableRoomsByDateRangeQuery({
 *   variables: {
 *      range: // value for 'range'
 *   },
 * });
 */
export function useAvailableRoomsByDateRangeQuery(baseOptions: Apollo.QueryHookOptions<AvailableRoomsByDateRangeQuery, AvailableRoomsByDateRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableRoomsByDateRangeQuery, AvailableRoomsByDateRangeQueryVariables>(AvailableRoomsByDateRangeDocument, options);
      }
export function useAvailableRoomsByDateRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableRoomsByDateRangeQuery, AvailableRoomsByDateRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableRoomsByDateRangeQuery, AvailableRoomsByDateRangeQueryVariables>(AvailableRoomsByDateRangeDocument, options);
        }
export type AvailableRoomsByDateRangeQueryHookResult = ReturnType<typeof useAvailableRoomsByDateRangeQuery>;
export type AvailableRoomsByDateRangeLazyQueryHookResult = ReturnType<typeof useAvailableRoomsByDateRangeLazyQuery>;
export type AvailableRoomsByDateRangeQueryResult = Apollo.QueryResult<AvailableRoomsByDateRangeQuery, AvailableRoomsByDateRangeQueryVariables>;
export const UpdateCmsDocument = gql`
    mutation updateCMS($content: UpdateCmsInput!) {
  updateCms(UpdateCmsInput: $content) {
    id
    name
    category
    description
    qaType
    thumbnail
    createdDate
    updatedDate
  }
}
    `;
export type UpdateCmsMutationFn = Apollo.MutationFunction<UpdateCmsMutation, UpdateCmsMutationVariables>;

/**
 * __useUpdateCmsMutation__
 *
 * To run a mutation, you first call `useUpdateCmsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCmsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCmsMutation, { data, loading, error }] = useUpdateCmsMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdateCmsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCmsMutation, UpdateCmsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCmsMutation, UpdateCmsMutationVariables>(UpdateCmsDocument, options);
      }
export type UpdateCmsMutationHookResult = ReturnType<typeof useUpdateCmsMutation>;
export type UpdateCmsMutationResult = Apollo.MutationResult<UpdateCmsMutation>;
export type UpdateCmsMutationOptions = Apollo.BaseMutationOptions<UpdateCmsMutation, UpdateCmsMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($user: CreateUserInput!) {
  createUser(createUserInput: $user) {
    age
    avatar
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    showNoc
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($user: UpdateUserInput!) {
  updateUser(UpdateUserInput: $user) {
    age
    avatar
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    showNoc
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UsersDocument = gql`
    query Users($limit: Float!, $skip: Float!) {
  users(limit: $limit, skip: $skip) {
    age
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    avatar
    state
    showNoc
    phoneNumber
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
  usersCount
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserDocument = gql`
    query User($id: String!) {
  user(id: $id) {
    age
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    avatar
    state
    showNoc
    phoneNumber
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserSearchDocument = gql`
    query userSearch($query: String!) {
  usersSearch(searchInput: $query) {
    age
    biography
    description
    email
    firstName
    id
    lastName
    role
    status
    avatar
    state
    showNoc
    phoneNumber
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useUserSearchQuery__
 *
 * To run a query within a React component, call `useUserSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useUserSearchQuery(baseOptions: Apollo.QueryHookOptions<UserSearchQuery, UserSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserSearchQuery, UserSearchQueryVariables>(UserSearchDocument, options);
      }
export function useUserSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSearchQuery, UserSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserSearchQuery, UserSearchQueryVariables>(UserSearchDocument, options);
        }
export type UserSearchQueryHookResult = ReturnType<typeof useUserSearchQuery>;
export type UserSearchLazyQueryHookResult = ReturnType<typeof useUserSearchLazyQuery>;
export type UserSearchQueryResult = Apollo.QueryResult<UserSearchQuery, UserSearchQueryVariables>;
export const CreateVenueDocument = gql`
    mutation createVenue($venue: CreateVenueInput!) {
  createVenue(createVenueInput: $venue) {
    id
    name
    thumbnail
    description
    shortDescription
    venueCategory
  }
}
    `;
export type CreateVenueMutationFn = Apollo.MutationFunction<CreateVenueMutation, CreateVenueMutationVariables>;

/**
 * __useCreateVenueMutation__
 *
 * To run a mutation, you first call `useCreateVenueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVenueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVenueMutation, { data, loading, error }] = useCreateVenueMutation({
 *   variables: {
 *      venue: // value for 'venue'
 *   },
 * });
 */
export function useCreateVenueMutation(baseOptions?: Apollo.MutationHookOptions<CreateVenueMutation, CreateVenueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVenueMutation, CreateVenueMutationVariables>(CreateVenueDocument, options);
      }
export type CreateVenueMutationHookResult = ReturnType<typeof useCreateVenueMutation>;
export type CreateVenueMutationResult = Apollo.MutationResult<CreateVenueMutation>;
export type CreateVenueMutationOptions = Apollo.BaseMutationOptions<CreateVenueMutation, CreateVenueMutationVariables>;
export const UpdateVenueDocument = gql`
    mutation updateVenue($venue: UpdateVenueInput!) {
  updateVenue(UpdateVenueInput: $venue) {
    id
    name
    thumbnail
    description
    shortDescription
    venueCategory
  }
}
    `;
export type UpdateVenueMutationFn = Apollo.MutationFunction<UpdateVenueMutation, UpdateVenueMutationVariables>;

/**
 * __useUpdateVenueMutation__
 *
 * To run a mutation, you first call `useUpdateVenueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVenueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVenueMutation, { data, loading, error }] = useUpdateVenueMutation({
 *   variables: {
 *      venue: // value for 'venue'
 *   },
 * });
 */
export function useUpdateVenueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVenueMutation, UpdateVenueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVenueMutation, UpdateVenueMutationVariables>(UpdateVenueDocument, options);
      }
export type UpdateVenueMutationHookResult = ReturnType<typeof useUpdateVenueMutation>;
export type UpdateVenueMutationResult = Apollo.MutationResult<UpdateVenueMutation>;
export type UpdateVenueMutationOptions = Apollo.BaseMutationOptions<UpdateVenueMutation, UpdateVenueMutationVariables>;
export const VenuesDocument = gql`
    query Venues {
  venues {
    id
    name
    thumbnail
    shortDescription
    description
    venueCategory
    venueInfo {
      contactEmail
      contactPhone
      locationLink
      venueLocationName
      venueStreetAddress
      venueWebsite
      hotelRanking
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
    state
    createdBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
    updatedBy {
      date
      user {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useVenuesQuery__
 *
 * To run a query within a React component, call `useVenuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenuesQuery({
 *   variables: {
 *   },
 * });
 */
export function useVenuesQuery(baseOptions?: Apollo.QueryHookOptions<VenuesQuery, VenuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenuesQuery, VenuesQueryVariables>(VenuesDocument, options);
      }
export function useVenuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenuesQuery, VenuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenuesQuery, VenuesQueryVariables>(VenuesDocument, options);
        }
export type VenuesQueryHookResult = ReturnType<typeof useVenuesQuery>;
export type VenuesLazyQueryHookResult = ReturnType<typeof useVenuesLazyQuery>;
export type VenuesQueryResult = Apollo.QueryResult<VenuesQuery, VenuesQueryVariables>;
export const VenueDocument = gql`
    query Venue($id: String!) {
  venue(id: $id) {
    id
    name
    thumbnail
    shortDescription
    description
    venueCategory
    venueInfo {
      contactEmail
      contactPhone
      locationLink
      venueLocationName
      venueStreetAddress
      venueWebsite
      hotelRanking
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useVenueQuery__
 *
 * To run a query within a React component, call `useVenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVenueQuery(baseOptions: Apollo.QueryHookOptions<VenueQuery, VenueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenueQuery, VenueQueryVariables>(VenueDocument, options);
      }
export function useVenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenueQuery, VenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenueQuery, VenueQueryVariables>(VenueDocument, options);
        }
export type VenueQueryHookResult = ReturnType<typeof useVenueQuery>;
export type VenueLazyQueryHookResult = ReturnType<typeof useVenueLazyQuery>;
export type VenueQueryResult = Apollo.QueryResult<VenueQuery, VenueQueryVariables>;
export const VenuesByCategoryDocument = gql`
    query VenuesByCategory($type: VenueCategoryInput!) {
  venuesByCategoy(VenueCategoryInput: $type) {
    id
    name
    thumbnail
    shortDescription
    description
    venueCategory
    venueInfo {
      contactEmail
      contactPhone
      locationLink
      venueLocationName
      venueStreetAddress
      venueWebsite
      hotelRanking
    }
    rating {
      rate
      rating {
        comment
        createdDate
        stars
        user {
          id
          firstName
          lastName
          avatar
          role
        }
      }
    }
  }
}
    `;

/**
 * __useVenuesByCategoryQuery__
 *
 * To run a query within a React component, call `useVenuesByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenuesByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenuesByCategoryQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useVenuesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<VenuesByCategoryQuery, VenuesByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenuesByCategoryQuery, VenuesByCategoryQueryVariables>(VenuesByCategoryDocument, options);
      }
export function useVenuesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenuesByCategoryQuery, VenuesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenuesByCategoryQuery, VenuesByCategoryQueryVariables>(VenuesByCategoryDocument, options);
        }
export type VenuesByCategoryQueryHookResult = ReturnType<typeof useVenuesByCategoryQuery>;
export type VenuesByCategoryLazyQueryHookResult = ReturnType<typeof useVenuesByCategoryLazyQuery>;
export type VenuesByCategoryQueryResult = Apollo.QueryResult<VenuesByCategoryQuery, VenuesByCategoryQueryVariables>;
export const TakenRanksDocument = gql`
    query takenRanks($type: VenueCategoryInput!) {
  takenRanks(VenueCategoryInput: $type)
}
    `;

/**
 * __useTakenRanksQuery__
 *
 * To run a query within a React component, call `useTakenRanksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTakenRanksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTakenRanksQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useTakenRanksQuery(baseOptions: Apollo.QueryHookOptions<TakenRanksQuery, TakenRanksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TakenRanksQuery, TakenRanksQueryVariables>(TakenRanksDocument, options);
      }
export function useTakenRanksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TakenRanksQuery, TakenRanksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TakenRanksQuery, TakenRanksQueryVariables>(TakenRanksDocument, options);
        }
export type TakenRanksQueryHookResult = ReturnType<typeof useTakenRanksQuery>;
export type TakenRanksLazyQueryHookResult = ReturnType<typeof useTakenRanksLazyQuery>;
export type TakenRanksQueryResult = Apollo.QueryResult<TakenRanksQuery, TakenRanksQueryVariables>;