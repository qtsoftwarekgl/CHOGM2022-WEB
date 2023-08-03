import { EStatus } from '@chogm2022/enums';
import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { CreatedBy } from '../../utils/abstract/abstract-track.entity';

@ObjectType()
@Schema()
export class Booking {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  id: ObjectId;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Field(() => Room)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  room: Types.ObjectId;

  @Field(() => Room)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', default: null })
  oldroom: Types.ObjectId;

  @Field(() => EStatus)
  @Prop({ default: EStatus.PENDING })
  status: string;

  @Field(() => CreatedBy)
  @Prop({ default: null })
  actionUser: CreatedBy;

  @Field({ nullable: true })
  @Prop({ default: null })
  message: string;

  @Field(() => GraphQLISODateTime)
  @Prop()
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  @Prop()
  endDate: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now() })
  createdDate: Date;
}

registerEnumType(EStatus, { name: 'EStatus' });

export const BookingSchema = SchemaFactory.createForClass(Booking);
