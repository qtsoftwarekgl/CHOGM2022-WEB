import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { VenuesModule } from '../venues/venues.module';
import { Room, RoomSchema } from './entities/room.entity';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './services/rooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    VenuesModule,
    AuthModule,
  ],
  providers: [RoomsResolver, RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
