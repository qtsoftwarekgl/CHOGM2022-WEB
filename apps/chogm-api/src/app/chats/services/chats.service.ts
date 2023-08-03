import { EChatType, ENotificationType } from '@chogm2022/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model, Types } from 'mongoose';
import { PUB_SUB } from '../../config/pub-sub.module';
import { CreateNotificationInput } from '../../notifications/dto/create-notification.input';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { PushNotificationsService } from '../../notifications/services/push-notification.service';
import {
  notificationPayload,
  notificationPayloadExpo,
} from '../../users/utils/utils';
import { localDate } from '../../utils/abstract/utils';
import {
  CHAT_EVENT,
  QUERY_CHAT_EVENT,
  USER_CHART_EVENT,
} from '../../utils/events';
import { _idToid } from '../../utils/id-reviver';
import messages from '../../utils/messages';
import {
  CreateChatInput,
  NewChat,
  NewMessage,
  queryTypeInput,
} from '../dto/create-chat.input';
import { ReplyChatInput } from '../dto/reply-chat.input';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatsService {
  private populate = ['users'];
  constructor(
    @InjectModel(Chat.name) private readonly chatRepository: Model<Chat>,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private readonly push: PushNotificationsService,
    private readonly notificationService: NotificationsService
  ) {}

  async create(input: CreateChatInput): Promise<Chat> {
    try {
      const { sender, receiver, message, queryType } = input;
      const msg: NewMessage = {
        sender: sender,
        message,
        createdDate: localDate(new Date()),
      };
      const msgFound = await this.chatRepository
        .findOne({
          users: { $all: [this.ObjectId(sender), this.ObjectId(receiver)] },
          queryType: input.queryType,
        })
        .exec();

      if (!msgFound) {
        const chat: NewChat = {
          users: [sender, receiver],
          messages: [msg],
          chatType:
            sender === null || receiver === null
              ? EChatType.NOC
              : EChatType.PARTICIPANT,
          queryType,
        };
        const res = await (
          await new this.chatRepository(chat).save()
        ).populate(this.populate);
        this.saveNotification(input, res._id, res);
        return res;
      } else {
        throw new HttpException(messages.CHAT_IS_NOT_NEW, HttpStatus.CONFLICT);
      }
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async update(input: ReplyChatInput): Promise<Chat> {
    try {
      const { sender, chatId, message } = input;
      const msg: NewMessage = {
        sender: sender,
        message,
        createdDate: localDate(new Date()),
      };
      const res = await this.chatRepository
        .findOneAndUpdate(
          { _id: chatId },
          { $push: { messages: msg } },
          { new: true }
        )
        .populate(this.populate)
        .exec();
      const chat = {
        message,
        sender: sender,
        receiver:
          !sender || sender === null
            ? res?.users?.find((id) => id !== null)
            : null,
      };
      this.saveNotification(chat, res._id, res);
      return res;
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findAllUserId(userId: string): Promise<Chat[]> {
    try {
      return await this.chatRepository
        .find({ users: userId })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findChat(chatId: string): Promise<Chat> {
    try {
      return await this.chatRepository
        .findById(chatId)
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findNocMessages(): Promise<Chat[]> {
    try {
      return await this.chatRepository
        .find({ chatType: EChatType.NOC })
        .populate(this.populate)
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  async findCategorizedChats(type: queryTypeInput): Promise<Chat[]> {
    try {
      return await this.chatRepository
        .find({ queryType: type.queryType })
        .populate(['users'])
        .exec();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.CONFLICT);
    }
  }

  ObjectId(input: string): Types.ObjectId | null {
    const objectId = Types.ObjectId;
    return input === null ? null : new objectId(input);
  }

  saveNotification(chat: any, chatId: string, realChat: Chat): void {
    realChat.users = realChat.users.filter((item) => item !== null);
    let content = '';
    let type: ENotificationType;
    let from = null;
    let receiverId = null;
    const { sender, receiver, message } = chat;

    if (!receiver) {
      type = ENotificationType.NEW_CHAT_NOC;
      from = sender;
      // all
      this.pubSub.publish(CHAT_EVENT, {
        chatEvent: _idToid(realChat),
      });
      // by query type
      this.pubSub.publish(QUERY_CHAT_EVENT, {
        queryChatEvent: _idToid(realChat),
      });
    }

    if (!sender) {
      type = ENotificationType.NEW_CHAT_PARTICIPANT;
      this.pubSub.publish(USER_CHART_EVENT, {
        userChatEvent: _idToid(realChat),
      });
      receiverId = realChat.users[0];
      this.push.sendToDevicesExpo(
        [realChat.users[0]['deviceRegistrationId']] || [],
        notificationPayloadExpo(realChat.id.toString(), 'New Chat', message)
      );
    }

    content = message;

    const notification: CreateNotificationInput = {
      type,
      content,
      userId: sender,
      payload: {
        payloadId: chatId,
        from,
      },
    };

    this.notificationService.create(notification, receiverId);
  }
}
