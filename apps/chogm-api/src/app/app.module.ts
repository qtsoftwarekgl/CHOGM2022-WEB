import { ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { environment } from '../environments/environment';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ChatsModule } from './chats/chats.module';
import { CmsModule } from './cms/cms.module';
import { PubSubModule } from './config/pub-sub.module';
import { ForumsModule } from './forums/forums.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { UploadScalar } from './utils/scalars/upload.scalar';
import { VenuesModule } from './venues/venues.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      debug: true,
      playground: environment?.uat,
      sortSchema: true,
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      autoSchemaFile: 'apps/chogm-api/src/app/graphql.schema.gql',
      resolvers: { Upload: GraphQLUpload },
      uploads: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'), // <-- path to the static files
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: environment.mongo_uri,
        useNewUrlParser: true,
      }),
    }),
    PubSubModule,
    UsersModule,
    AuthModule,
    VenuesModule,
    RoomsModule,
    ForumsModule,
    ProgrammesModule,
    CmsModule,
    BookingsModule,
    NotificationsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [AppResolver, UploadScalar],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
