import { IProgramme } from '@chogm2022/interfaces';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Forum } from '../../forums/entities/forum.entity';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { Rate } from '../../utils/abstract/rating.entity';
import { RatingMiddleware } from '../../utils/middleware/rating.middleware';

@ObjectType()
@Schema()
export class Programme extends AuditTrack implements IProgramme {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => Room, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: false })
  room: Types.ObjectId;

  @Field(() => Forum)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Forum' })
  forum: Types.ObjectId;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date })
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date })
  endDate: Date;

  @Field(() => [User])
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  speakers: string[];

  @Field(() => [User])
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  moderator: string[];

  @Field({ nullable: true })
  @Prop({ required: false })
  broadcastLink: string;

  @Field(() => Rate, { middleware: [RatingMiddleware] })
  @Prop({ default: { rate: 0, rating: [] } })
  rating: Rate;
}

export const ProgrammeSchema = SchemaFactory.createForClass(Programme);
