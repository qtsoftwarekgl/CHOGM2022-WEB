import { IRoom, IRoomAmenities } from '@chogm2022/interfaces';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { ThumbnailMiddleware } from '../../utils/middleware/thumbnail.middleware';
import { Venue } from '../../venues/entities/venue.entity';

@ObjectType()
export class RoomAmenities implements IRoomAmenities {
  @Field()
  @Prop()
  conditioner: boolean;

  @Field()
  @Prop()
  wifi: boolean;

  @Field()
  @Prop()
  microphone: boolean;

  @Field()
  @Prop()
  projector: boolean;

  @Field()
  @Prop()
  camera: boolean;
}

@ObjectType()
@Schema()
export class Room extends AuditTrack implements IRoom {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop({ unique: true })
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field({ middleware: [ThumbnailMiddleware] })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => Venue)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venue' })
  venue: Types.ObjectId;

  @Field()
  @Prop({ default: true, required: false })
  availability: boolean;

  @Field(() => RoomAmenities)
  @Prop()
  amenities: RoomAmenities;

  @Field(() => Number)
  @Prop({ default: 0 })
  capacity: number;

  @Field(() => Boolean)
  @Prop({ default: false })
  bookable: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  isMediaRoom: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
