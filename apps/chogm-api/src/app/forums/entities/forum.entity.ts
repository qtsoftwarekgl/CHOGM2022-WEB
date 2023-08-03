import { IForum } from '@chogm2022/interfaces';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { Rate } from '../../utils/abstract/rating.entity';
import { RatingMiddleware } from '../../utils/middleware/rating.middleware';
import { ThumbnailMiddleware } from '../../utils/middleware/thumbnail.middleware';
import { Venue } from '../../venues/entities/venue.entity';

@ObjectType()
@Schema()
export class Forum extends AuditTrack implements IForum {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop({ unique: true })
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field({ middleware: [ThumbnailMiddleware] })
  @Prop()
  thumbnail: string;

  @Field(() => Venue)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venue' })
  venue: Types.ObjectId;

  @Field(() => Rate, { middleware: [RatingMiddleware] })
  @Prop({ default: { rate: 0, rating: [] } })
  rating: Rate;

  @Field({ defaultValue: true })
  @Prop()
  status: boolean;

  @Field(() => [String])
  @Prop({ default: [], required: false })
  attendees: string[];

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date })
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date })
  endDate: Date;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
