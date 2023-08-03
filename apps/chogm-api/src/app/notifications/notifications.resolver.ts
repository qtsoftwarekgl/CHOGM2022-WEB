import { ENotificationType } from '@chogm2022/enums';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GqlAuthGuard } from '../auth/auth.guard';
import { PUB_SUB } from '../config/pub-sub.module';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { NOTIFICATION_EVENT, USER_NOTIFICATION_EVENT } from '../utils/events';
import { UpdateSeenNotificationInput } from './dto/update-notification.input';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './services/notifications.service';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification], { name: 'notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification], { name: 'broadcastedMessages' })
  findAllBroadcastedMessages() {
    return this.notificationsService.findAllBroadcastedMessages();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification], { name: 'notificationsByUser' })
  findAllByUser(@Args('userId') id: string, @CurrentUser() user: User) {
    return this.notificationsService.findbyUser(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  updateNotification(
    @Args('UpdateSeenNotificationInput')
    input: UpdateSeenNotificationInput
  ) {
    return this.notificationsService.updateSeen(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  BroadcastMessage(
    @Args('title') title: string,
    @Args('message') message: string,
    @CurrentUser() user: User
  ) {
    return this.notificationsService.broadcastMessage(title, message, user);
  }

  @Subscription(() => Notification, {
    name: 'notificationEvent',
    filter: (payload, variables) => {
      return (
        payload.notificationEvent?.userId !== null &&
        (payload.notificationEvent?.type ===
          ENotificationType.BOOKING_REQUEST ||
          payload.notificationEvent?.type === ENotificationType.NEW_CHAT_NOC)
      );
    },
  })
  notificationEvent() {
    return this.pubSub.asyncIterator<Notification>(NOTIFICATION_EVENT);
  }

  @Subscription(() => Notification, {
    name: 'userNotificationEvent',
    filter: (payload, variables) => {
      const { receiverId, type } = payload.userNotificationEvent;
      return (
        (receiverId && receiverId?.id === variables.userId) ||
        receiverId === variables.userId ||
        type === ENotificationType.BROADCAST_MESSAGE
      );
    },
  })
  userNotificationEvent(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator<Notification>(USER_NOTIFICATION_EVENT);
  }
}
