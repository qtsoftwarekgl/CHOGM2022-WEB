import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { BookingsResolver } from './bookings.resolver';
import { Booking, BookingSchema } from './entities/booking.entity';
import { BookingsService } from './services/bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    NotificationsModule,
    UsersModule,
    RoomsModule,
    AuthModule,
    MailModule,
  ],
  providers: [BookingsResolver, BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
