import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class CreatedBy {
  @Field(() => User, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Field(() => String)
  @Prop()
  date: string;
}

@ObjectType()
export abstract class AuditTrack extends Document {
  @Field(() => Boolean)
  @Prop({ default: true })
  state: boolean;

  @Field(() => CreatedBy)
  @Prop()
  createdBy: CreatedBy;

  @Field(() => [CreatedBy])
  @Prop({ default: [] })
  updatedBy: CreatedBy[];
}

@InputType()
export abstract class AbstractState {
  @Field(() => Boolean, { nullable: true })
  state: boolean;
}
