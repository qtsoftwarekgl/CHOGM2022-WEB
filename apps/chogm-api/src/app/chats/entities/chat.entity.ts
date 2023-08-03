import { EChatType, EQAtypes } from '@chogm2022/enums';
import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Schema()
export class Message extends Document {
  @Field({ nullable: true })
  @Prop({ nullable: true })
  sender: string;

  @Field()
  @Prop({ required: true })
  message: string;

  @Field()
  @Prop({ type: String })
  createdDate: string;
}
@ObjectType()
@Schema()
export class Chat extends Document {
  @Field(() => ID)
  id: ObjectId;

  @Field(() => [User], { nullable: true })
  @Prop([
    {
      required: false,
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
    },
  ])
  users: string[];

  @Field(() => [Message])
  @Prop({ required: true })
  messages: Message[];

  @Field(() => EChatType)
  @Prop({ required: true, default: EChatType.NOC })
  chatType: string;

  @Field(() => EQAtypes)
  @Prop({ required: true })
  queryType: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now() })
  createdDate: Date;
}

registerEnumType(EChatType, { name: 'EChatType' });
registerEnumType(EQAtypes, { name: 'EChatType' });
export const ChatSchema = SchemaFactory.createForClass(Chat);
