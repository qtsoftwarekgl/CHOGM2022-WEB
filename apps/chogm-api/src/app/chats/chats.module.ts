import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsResolver } from './chats.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    NotificationsModule,
    AuthModule,
    UsersModule,
  ],
  providers: [ChatsResolver, ChatsService],
})
export class ChatsModule {}
