import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../../environments/environment';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './services/notifications.service';
import { PushNotificationsService } from './services/push-notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AuthModule,
    HttpModule.register({
      maxRedirects: 5,
    }),
    MailModule,
    UsersModule,
  ],
  providers: [
    NotificationsResolver,
    NotificationsService,
    PushNotificationsService,
  ],
  exports: [NotificationsService, PushNotificationsService],
})
export class NotificationsModule {}
