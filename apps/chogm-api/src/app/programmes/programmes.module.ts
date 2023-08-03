import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ForumsModule } from '../forums/forums.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { Programme, ProgrammeSchema } from './entities/programme.entity';
import { ProgrammesResolver } from './programmes.resolver';
import { ProgrammesService } from './services/programmes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Programme.name, schema: ProgrammeSchema },
    ]),
    UsersModule,
    ForumsModule,
    RoomsModule,
    AuthModule,
  ],
  providers: [ProgrammesResolver, ProgrammesService],
})
export class ProgrammesModule {}
