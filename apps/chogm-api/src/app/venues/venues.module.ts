import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Venue, VenueSchema } from './entities/venue.entity';
import { VenuesService } from './services/venues.service';
import { VenuesResolver } from './venues.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Venue.name, schema: VenueSchema }]),
    AuthModule,
  ],
  providers: [VenuesResolver, VenuesService],
  exports: [VenuesService],
})
export class VenuesModule {}
