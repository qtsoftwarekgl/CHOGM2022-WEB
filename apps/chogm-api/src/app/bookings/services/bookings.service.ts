import { EForumsvents, ENotificationType, EStatus } from '@chogm2022/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model, Types } from 'mongoose';
import { PUB_SUB } from '../../config/pub-sub.module';
import { MailService } from '../../mail/mail.service';
import { CreateNotificationInput } from '../../notifications/dto/create-notification.input';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { PushNotificationsService } from '../../notifications/services/push-notification.service';
import { Room } from '../../rooms/entities/room.entity';
import { RoomsService } from '../../rooms/services/rooms.service';
import { User } from '../../users/entities/user.entity';
import { notificationPayloadExpo } from '../../users/utils/utils';
import { createdBy, localDate } from '../../utils/abstract/utils';
import { BOOKING_REQUEST_EVENT } from '../../utils/events';
import { _idToid } from '../../utils/id-reviver';
import messages from '../../utils/messages';
import { CreateBookingInput } from '../dto/create-booking.input';
import { DateRangeInput } from '../dto/date-range-room.input';
import { ApproveBookingInput } from '../dto/update-booking.input';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingsService {
  private populate = [
    'user',
    'room',
    {
      path: 'room',
      populate: {
        path: 'venue',
        model: 'Venue',
      },
    },
  ];
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingRepository: Model<Booking>,
    private readonly notificationService: NotificationsService,
    private readonly roomService: RoomsService,
    private readonly push: PushNotificationsService,
    private readonly mail: MailService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  async create(booking: CreateBookingInput): Promise<Booking> {
    try {
      const { user, room } = booking;

      const nowDate = localDate(new Date());
      const requestStartDate = new Date(booking.startDate).toISOString();

      const startHour = new Date(booking.startDate).getHours();
      const endHour = new Date(booking.endDate).getHours();
      const startMin = new Date(booking.endDate).getMinutes();
      const endMin = new Date(booking.endDate).getMinutes();

      if (
        startHour < 8 ||
        startHour > 20 ||
        endHour < 8 ||
        endHour > 20 ||
        (startHour === 20 && startMin > 0) ||
        (endHour === 20 && endMin > 0)
      ) {
        throw new HttpException(
          messages.BOOKING_INVALID_DATE_RANGE,
          HttpStatus.FORBIDDEN
        );
      }

      if (nowDate > requestStartDate) {
        throw new HttpException(
          messages.BOOKING_SHOULD_BE_IN_FUTURE,
          HttpStatus.CONFLICT
        );
      }

      await this.checkRoom(
        requestStartDate,
        room,
        messages.PICK_ANOTHER_TIME_ROOM_BOOKING(
          new Date(booking.startDate),
          new Date(booking.endDate)
        )
      );

      const alreadyBooked = await this.bookingRepository.findOne({
        user: new Types.ObjectId(user),
        room: new Types.ObjectId(room),
      });

      if (alreadyBooked?.status === EStatus.PENDING) {
        throw new HttpException(messages.ALLREADY_BOOKED, HttpStatus.CONFLICT);
      }

      const res = await (
        await new this.bookingRepository(booking).save()
      ).populate(this.populate);
      this.invokeNotification(res);
      return res;
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.CONFLICT);
    }
  }

  async update(input: ApproveBookingInput, id: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepository
        .findById(input.bookingId)
        .exec();
      let oldroom = null;
      const message = null;

      if (
        input.status === EStatus.APPROVED_REASSIGNED ||
        input.status === EStatus.APPROVED
      ) {
        const room_ =
          input.status === EStatus.APPROVED
            ? booking?.room?.toString()
            : input.room;

        if (input.status === EStatus.APPROVED_REASSIGNED) {
          if (!input.room) {
            throw new HttpException(
              'provide room for re-assignment',
              HttpStatus.CONFLICT
            );
          }
          oldroom = booking.room;
        }

        const requestStartDate = new Date(booking?.startDate).toISOString();
        await this.checkRoom(
          requestStartDate,
          room_,
          messages.YOU_CANT_APPROVE
        );
      }

      if (input.status !== EStatus.APPROVED_REASSIGNED) {
        delete input.room;
      }

      const res = await this.bookingRepository
        .findOneAndUpdate(
          { _id: input.bookingId },
          { ...input, oldroom, message, actionUser: createdBy(id) },
          {
            new: true,
          }
        )
        .populate(this.populate)
        .exec();
      this.invokeNotification(res);
      return res;
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      return await this.bookingRepository
        .find()
        .sort({ createdDate: -1 })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.CONFLICT);
    }
  }

  async findOne(id: string): Promise<Booking> {
    try {
      return await this.bookingRepository
        .findById(id)
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.CONFLICT);
    }
  }

  async findBy(condition: any): Promise<Booking[]> {
    try {
      return await this.bookingRepository
        .find(condition)
        .sort({ createdDate: -1 })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.CONFLICT);
    }
  }

  async findAllByAmenities(condition: any, user: User): Promise<Room[]> {
    try {
      const mediaRoom = this.mediaRoomQuery(user);
      const availableRooms = [];
      const query = {};
      Object.keys(condition).forEach((key) => {
        if (condition[key]) {
          query[`amenities.${key}`] = condition[key];
        }
      });
      const bookings = await this.activeBookings();

      const rooms = await this.roomService.findBy({
        ...query,
        ...mediaRoom,
        ...{ state: true, bookable: true },
      });

      rooms.forEach((el) => {
        if (
          bookings?.length > 0 &&
          bookings.find((b) => b?.room?._id.toString() === el?._id.toString())
        ) {
          return;
        }
        availableRooms.push(el);
      });

      return availableRooms;
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findAllRoomsByDate(range: DateRangeInput, user: User): Promise<Room[]> {
    try {
      const mediaRoom = this.mediaRoomQuery(user);
      const availableRooms = [];
      const { startDate: s, endDate: e } = range;

      const bookings = (
        await this.bookingRepository.find().populate(this.populate).exec()
      ).filter(
        ({ startDate, endDate, status }) =>
          ((status === EStatus.APPROVED ||
            status === EStatus.APPROVED_REASSIGNED) &&
            new Date(startDate).toISOString() >= new Date(s).toISOString() &&
            new Date(startDate).toISOString() <= new Date(e).toISOString()) ||
          (new Date(endDate).toISOString() >= new Date(s).toISOString() &&
            new Date(endDate).toISOString() <= new Date(e).toISOString())
      );

      const rooms = await this.roomService.findBy({
        ...mediaRoom,
        state: true,
        bookable: true,
      });

      rooms.forEach((el) => {
        if (
          bookings?.length > 0 &&
          bookings.find((b) => b?.room?._id.toString() === el?._id.toString())
        ) {
          return;
        }
        availableRooms.push(el);
      });

      return availableRooms;
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async checkRoom(requestStartDate: string, room: string, message = null) {
    const bookedRoom = await this.bookingRepository.findOne({
      room: new Types.ObjectId(room),
    });

    if (bookedRoom?.id) {
      const bookedRoomStartDate = new Date(bookedRoom.startDate).toISOString();
      const bookedRoomEndDate = new Date(bookedRoom.endDate).toISOString();

      if (
        (bookedRoom.status === EStatus.APPROVED ||
          bookedRoom.status === EStatus.APPROVED_REASSIGNED) &&
        requestStartDate >= bookedRoomStartDate &&
        requestStartDate < bookedRoomEndDate
      ) {
        throw new HttpException(
          message || messages.ROOM_IS_NOT_AVAILABLE,
          HttpStatus.CONFLICT
        );
      }
    }
  }

  async findAllAvailableRooms(user: User): Promise<Room[]> {
    const availableRooms = [];
    const mediaRoom = this.mediaRoomQuery(user);
    const bookings = await this.activeBookings();
    const rooms = await this.roomService.findBy({
      ...mediaRoom,
      state: true,
      bookable: true,
    });

    rooms.forEach((el) => {
      if (
        bookings?.length > 0 &&
        bookings.find((b) => b?.room?._id.toString() === el?._id.toString())
      ) {
        return;
      }
      availableRooms.push(el);
    });

    return availableRooms;
  }

  async activeBookings() {
    const date = localDate(new Date());
    const bookings = (
      await this.bookingRepository.find().populate(this.populate).exec()
    ).filter(
      // filter if now date is between booking start and end dates or is greater than booking end dates(booking done)
      ({ startDate, endDate, status }) =>
        ((status === EStatus.APPROVED ||
          status === EStatus.APPROVED_REASSIGNED) &&
          date <= new Date(startDate).toISOString() &&
          date < new Date(endDate).toISOString()) ||
        date > new Date(endDate).toISOString()
    );
    return bookings;
  }

  mediaRoomQuery(user: User): any {
    return user?.events?.find((t) => t === EForumsvents.MEDIA_FORUM)
      ? { isMediaRoom: true }
      : { isMediaRoom: false };
  }

  getTime(date: string | Date): any {
    return `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
  }

  async invokeNotification(booking: Booking): Promise<void> {
    let content = '';
    let content1 = '';
    let type: ENotificationType;
    let receiverId = null;

    let from = null;
    const { user, room, startDate, endDate } = booking;
    switch (booking.status) {
      case EStatus.PENDING:
        content = `${user['firstName']} ${user['lastName']} Requested ${room['name']} 
            for booking`;
        type = ENotificationType.BOOKING_REQUEST;
        from = user._id;
        content1 = `Your request for meeting room on ${new Date(
          booking?.startDate
        ).toLocaleDateString()} at ${this.getTime(startDate)} - ${this.getTime(
          endDate
        )} was received. Could you kindly inform us, via protocol@chogm2022.rw,  
        from which delegation you are and the counterpart delegation you are meeting with?`;

        this.mail.bookingActionSendMail(user, 'Booking Request', content1);
        break;
      case EStatus.APPROVED:
        content = `Your request for meeting room booked on ${new Date(
          booking?.startDate
        ).toLocaleDateString()} at ${this.getTime(startDate)} - ${this.getTime(
          endDate
        )} is approved.
        Thank you
        `;

        content1 = `Your request for meeting room booked on ${new Date(
          booking?.startDate
        ).toLocaleDateString()} at ${this.getTime(startDate)} - ${this.getTime(
          endDate
        )} is approved.`;
        type = ENotificationType.BOOKING_APPROVED;
        receiverId = user.id;

        this.push.sendToDevicesExpo(
          [user['deviceRegistrationId']] || [],
          notificationPayloadExpo(
            booking.id.toString(),
            'Booking Approved',
            content
          )
        );
        this.mail.bookingActionSendMail(user, 'Booking Approved', content1);
        break;
      case EStatus.CANCELLED:
        content = `Your request for meeting room booked on ${new Date(
          booking?.startDate
        ).toLocaleDateString()} at ${this.getTime(startDate)} - ${this.getTime(
          endDate
        )} was rejected. Please call 9007 for support`;

        content1 = `Your request for meeting room booked on ${new Date(
          booking?.startDate
        ).toLocaleDateString()} at ${this.getTime(startDate)} - ${this.getTime(
          endDate
        )} was rejected. Please call 9007 for support.
      `;
        type = ENotificationType.BOOKING_CANCELLED;
        receiverId = user.id;
        this.push.sendToDevicesExpo(
          [user['deviceRegistrationId']] || [],
          notificationPayloadExpo(
            booking.id.toString(),
            'Booking Cancelled',
            content
          )
        );
        this.mail.bookingActionSendMail(user, 'Booking Cancelled', content);
        break;
      case EStatus.APPROVED_REASSIGNED:
        content = `The meeting room you requested is not available, meeting room ${room['name']} has been booked for you.
        Thank you
        `;
        content1 = `The meeting room you requested is not available, we have booked for you room ${room['name']} instead.
        Thank you
        `;
        type = ENotificationType.BOOKING_ROOM_CHANGED;
        receiverId = user.id;
        this.push.sendToDevicesExpo(
          [user['deviceRegistrationId']] || [],
          notificationPayloadExpo(
            booking.id.toString(),
            'Booking Approved with re-assign',
            content
          )
        );
        this.mail.bookingActionSendMail(
          user,
          'Booking Approved with re-assign',
          content1
        );
        break;
    }

    const notification: CreateNotificationInput = {
      type,
      content,
      userId: booking.user._id.toHexString(),
      payload: {
        payloadId: booking.id.toString(),
        from,
      },
    };

    this.pubSub.publish(BOOKING_REQUEST_EVENT, {
      bookingRequestEvent: _idToid(booking),
    });

    this.notificationService.create(notification, receiverId);
  }
}
