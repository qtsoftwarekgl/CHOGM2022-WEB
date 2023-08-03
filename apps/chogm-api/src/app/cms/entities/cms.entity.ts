import { ECMSTypes, EQAtypes } from '@chogm2022/enums';
import { ICMS } from '@chogm2022/interfaces';
import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { ThumbnailMiddleware } from '../../utils/middleware/thumbnail.middleware';

@ObjectType()
export class OtherInfo {
  @Field({ nullable: true })
  @Prop()
  contactPhone: string;

  @Field({ nullable: true })
  @Prop()
  contactEmail: string;

  @Field({ nullable: true })
  @Prop()
  website: string;

  @Field({ defaultValue: '', middleware: [ThumbnailMiddleware] })
  @Prop({ default: '' })
  pdfFile: string;
}

@ObjectType()
@Schema()
export class Cms extends AuditTrack implements ICMS {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field({ middleware: [ThumbnailMiddleware], nullable: true })
  @Prop()
  thumbnail: string;

  @Field(() => ECMSTypes)
  @Prop({ type: String })
  category: ECMSTypes;

  @Field(() => EQAtypes, { nullable: true })
  @Prop({ type: String, required: false })
  qaType?: EQAtypes;

  @Field(() => OtherInfo, { nullable: true })
  @Prop({ type: OtherInfo, required: false })
  otherInfo: OtherInfo;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now() })
  createdDate: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now() })
  updatedDate: Date;
}

registerEnumType(ECMSTypes, { name: 'ECMSTypes' });
registerEnumType(EQAtypes, { name: 'EQAtypes' });

export const CmsSchema = SchemaFactory.createForClass(Cms);
