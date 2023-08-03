import { EVenueType } from '@chogm2022/enums';
import { IVenue, IVenueInfo } from '@chogm2022/interfaces';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { AuditTrack } from '../../utils/abstract/abstract-track.entity';
import { Rate } from '../../utils/abstract/rating.entity';
import { RatingMiddleware } from '../../utils/middleware/rating.middleware';
import { ThumbnailMiddleware } from '../../utils/middleware/thumbnail.middleware';

@ObjectType()
export class VenueInfo implements IVenueInfo {
  @Field({ nullable: true })
  @Prop()
  contactPhone: string;

  @Field({ nullable: true })
  @Prop()
  contactEmail: string;

  @Field({ nullable: true })
  @Prop()
  venueWebsite: string;

  @Field({ nullable: true })
  @Prop()
  venueStreetAddress: string;

  @Field({ nullable: true })
  @Prop()
  venueLocationName: string;

  @Field()
  @Prop()
  locationLink: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  hotelRanking: number;
}

@ObjectType()
@Schema()
export class Venue extends AuditTrack implements IVenue {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop({ length: 50 })
  shortDescription: string;

  @Field()
  @Prop()
  description: string;

  @Field({ middleware: [ThumbnailMiddleware] })
  @Prop()
  thumbnail: string;

  @Field(() => EVenueType)
  @Prop({ type: String })
  venueCategory: EVenueType;

  @Field(() => VenueInfo)
  @Prop({ type: VenueInfo })
  venueInfo: VenueInfo;

  @Field(() => Rate, { middleware: [RatingMiddleware] })
  @Prop({ default: { rate: 0, rating: [] } })
  rating: Rate;
}

registerEnumType(EVenueType, { name: 'EVenueType' });
export const VenueSchema = SchemaFactory.createForClass(Venue);
