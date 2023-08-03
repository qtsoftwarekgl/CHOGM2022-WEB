import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { MailModule } from '../mail/mail.module';
import { NotificationSchema } from '../notifications/entities/notification.entity';
import { UserSchema } from '../users/entities/user.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './service/auth.service';
import { ChogmIntegrationService } from './service/integration.service';
import { JwtStrategy } from './service/jwt-strategy.service';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      headers: {
        'x-auth': environment.chogm_api_x_auth,
        'app-version': environment.chogm_api_version,
        'app-device': environment.chogm_api_device,
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register({
      secret: environment.jwt_secret,
      signOptions: {
        expiresIn: environment.jwt_expiresin,
      },
    }),
    MailModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, ChogmIntegrationService],
  exports: [PassportModule, JwtModule, ChogmIntegrationService],
})
export class AuthModule {}
