import { EUserRole } from '@chogm2022/enums';
import { IUser } from '@chogm2022/interfaces';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ConvidResult } from '../../auth/dto/covid-result.input';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { Rate } from '../../utils/abstract/rating.entity';
import { RatingMiddleware } from '../../utils/middleware/rating.middleware';
import { ThumbnailMiddleware } from '../../utils/middleware/thumbnail.middleware';

@ObjectType()
export class Identity {
  @Field()
  @Prop()
  identityType: string;

  @Field()
  @Prop()
  identityNumber: string;
}

@ObjectType()
export class Verification {
  @Field()
  @Prop()
  code: string;

  @Field()
  @Prop()
  expiryDate: string;
}

@ObjectType()
@Schema()
export class User extends AuditTrack implements IUser {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ unique: true, required: true })
  email: string;

  @Field(() => [EUserRole])
  @Prop({ required: true })
  role: EUserRole[];

  @Field()
  @Prop({ default: '' })
  description: string;

  @Field()
  @Prop({ default: '' })
  biography: string;

  @Field({ nullable: true })
  @Prop({ default: 0, required: false })
  age?: number;

  @Field({ defaultValue: '', middleware: [ThumbnailMiddleware] })
  @Prop({ required: false })
  avatar?: string;

  @Field({ defaultValue: true })
  @Prop({ required: false })
  status?: boolean;

  @Field({ nullable: true })
  @Prop({ required: false })
  title?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  dateOfBirth?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  gender?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  passport?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  nationality?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  occupation?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  residenceCountry?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  company?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  qrcodeData?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  category?: string;

  @Field()
  @Prop({ required: false })
  password?: string;

  @Field(() => Rate, { middleware: [RatingMiddleware] })
  @Prop({ default: { rate: 0, rating: [] } })
  rating: Rate;

  @Field()
  @Prop({ required: false, default: null })
  deviceRegistrationId?: string;

  @Field(() => [Number])
  @Prop({ nullable: true, default: [] })
  events: number[];

  @Field()
  @Prop({ default: null })
  accreditationId: string;

  @Field(() => Identity)
  @Prop({ default: null })
  identity: Identity;

  @Field(() => Verification)
  @Prop({ default: null })
  verificationCode: Verification;

  @Field({ defaultValue: false })
  @Prop({ required: false, default: false })
  showNoc: boolean;

  @Prop({ required: false, nullable: true })
  accreditationToken: string;

  @Field(() => ConvidResult)
  @Prop({ required: false, nullable: true })
  covidResult: ConvidResult;
}

registerEnumType(EUserRole, { name: 'EUserRole' });
export const UserSchema = SchemaFactory.createForClass(User);
