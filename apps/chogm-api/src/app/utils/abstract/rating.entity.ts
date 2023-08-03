import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Rating {
  @Field(() => Number)
  @Prop()
  stars: number;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Field(() => String)
  @Prop()
  comment: string;

  @Field(() => String)
  @Prop({ type: String })
  createdDate: string;
}

@ObjectType()
export class Rate extends Document {
  @Field(() => Number)
  @Prop({ default: 0 })
  rate: number;

  @Field(() => [Rating])
  @Prop({ default: [] })
  rating: Rating[];
}
