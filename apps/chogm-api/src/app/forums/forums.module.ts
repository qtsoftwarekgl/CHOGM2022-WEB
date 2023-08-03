import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { VenuesModule } from '../venues/venues.module';
import { Forum, ForumSchema } from './entities/forum.entity';
import { ForumsResolver } from './forums.resolver';
import { ForumsService } from './services/forums.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    VenuesModule,
    AuthModule,
  ],
  providers: [ForumsResolver, ForumsService],
  exports: [ForumsService],
})
export class ForumsModule {}
