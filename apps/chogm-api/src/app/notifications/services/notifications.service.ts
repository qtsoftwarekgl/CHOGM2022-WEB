import { ENotificationType } from '@chogm2022/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model, Types } from 'mongoose';
import { ChogmIntegrationService } from '../../auth/service/integration.service';
import { PUB_SUB } from '../../config/pub-sub.module';
import { MailService } from '../../mail/mail.service';
import { broadcastTempl } from '../../mail/templates/email.templates';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { notificationPayloadExpo } from '../../users/utils/utils';
import { createdBy } from '../../utils/abstract/utils';
import {
  NOTIFICATION_EVENT,
  USER_NOTIFICATION_EVENT,
} from '../../utils/events';
import { _idToid } from '../../utils/id-reviver';
import { CreateNotificationInput } from '../dto/create-notification.input';
import { UpdateSeenNotificationInput } from '../dto/update-notification.input';
import { Notification } from '../entities/notification.entity';
import { PushNotificationsService } from './push-notification.service';

@Injectable()
export class NotificationsService {
  private populate = [
    {
      path: 'payload',
      populate: {
        path: 'from',
        model: 'User',
      },
    },
  ];
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationRepository: Model<Notification>,
    private readonly push: PushNotificationsService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    private readonly integrationService: ChogmIntegrationService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  async create(
    request: CreateNotificationInput,
    receiverId = null
  ): Promise<Notification> {
    try {
      const notification = await new this.notificationRepository({
        ...request,
        receiverId,
      }).save();
      this.pubSub.publish(NOTIFICATION_EVENT, {
        notificationEvent: _idToid(notification),
      });
      this.pubSub.publish(USER_NOTIFICATION_EVENT, {
        userNotificationEvent: _idToid(notification),
      });
      return notification;
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationRepository
        .find({
          seen: false,
          receiverId: null,
          type: {
            $in: [
              ENotificationType.BOOKING_REQUEST,
              ENotificationType.NEW_CHAT_NOC,
            ],
          },
        })
        .populate(this.populate)
        .sort({ createdDate: -1 })
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findAllBroadcastedMessages(): Promise<Notification[]> {
    try {
      return await this.notificationRepository
        .find({
          type: ENotificationType.BROADCAST_MESSAGE,
        })
        .populate([
          ...this.populate,
          {
            path: 'payload.createdBy',
            populate: {
              path: 'user',
              model: 'User',
            },
          },
        ])
        .sort({ createdDate: -1 })
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findbyUser(id: string, user: User): Promise<Notification[]> {
    try {
      await this.integrationService.fetchCovidResults(user);
      return await this.notificationRepository
        .find({
          $or: [
            { receiverId: new Types.ObjectId(id) },
            { type: ENotificationType.BROADCAST_MESSAGE },
          ],
        })
        .populate(this.populate)
        .sort({ createdDate: -1 })
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async updateSeen(
    updateRequest: UpdateSeenNotificationInput
  ): Promise<boolean> {
    const update = await this.notificationRepository.updateMany(
      { _id: { $in: updateRequest.notificationIds } },
      { seen: true },
      { multi: true }
    );
    return !!update;
  }

  async broadcastMessage(
    title: string,
    message: string,
    user: User
  ): Promise<boolean> {
    const tokens: string[] = [];
    (await this.userService.findAll()).forEach(
      ({ deviceRegistrationId, email }) => {
        if (deviceRegistrationId) {
          tokens.push(deviceRegistrationId);
        }
        if (email) {
          this.mailService.sendEmail({
            to_email_address: email,
            email_subject: title,
            email_body: broadcastTempl(title, message),
          });
        }
      }
    );

    this.push.sendToDevicesExpo(
      tokens,
      notificationPayloadExpo('broadcast', title, message)
    );

    const notification: CreateNotificationInput = {
      type: ENotificationType.BROADCAST_MESSAGE,
      content: message,
      userId: null,
      payload: {
        payloadId: 'broadcast',
        from: user.id.toString(),
        title,
        ...{ createdBy: createdBy(user.id.toString()) },
      },
    };

    const msg = await this.create(notification, null);
    return !!msg;
  }
}
