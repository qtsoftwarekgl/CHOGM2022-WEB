import { ENotificationType } from '@chogm2022/enums';
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
import { User } from '../../users/entities/user.entity';
import { CreatedBy } from '../../utils/abstract/abstract-track.entity';
import { localDate } from '../../utils/abstract/utils';

@ObjectType()
@Schema()
export class NotificationPayload {
  @Field({ nullable: true })
  @Prop()
  payloadId: string;

  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  title: string;

  @Field(() => User, { nullable: true })
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  from: Types.ObjectId;

  @Field(() => CreatedBy)
  @Prop({ default: null })
  createdBy: CreatedBy;
}

@ObjectType()
@Schema()
export class Notification {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop()
  content: string;

  @Field(() => NotificationPayload)
  @Prop()
  payload: NotificationPayload;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  receiverId: Types.ObjectId;

  @Field(() => ENotificationType)
  @Prop({ type: String })
  type: string;

  @Field()
  @Prop({ default: false })
  seen: boolean;

  @Field(() => GraphQLISODateTime)
  @Prop({ default: new Date() })
  createdDate: Date;
}

registerEnumType(ENotificationType, { name: 'ENotificationType' });

export const NotificationSchema = SchemaFactory.createForClass(Notification);
