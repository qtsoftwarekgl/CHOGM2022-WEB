import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    MailModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
