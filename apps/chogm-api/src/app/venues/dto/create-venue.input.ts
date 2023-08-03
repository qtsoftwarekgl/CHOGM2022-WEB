import { EVenueType } from '@chogm2022/enums';
import { IVenue, IVenueInfo } from '@chogm2022/interfaces';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class VenueInfoInput implements IVenueInfo {
  @Field({ nullable: true })
  contactPhone: string;

  @Field({ nullable: true })
  contactEmail: string;

  @Field({ nullable: true })
  venueWebsite: string;

  @Field({ nullable: true })
  venueStreetAddress: string;

  @Field({ nullable: true })
  venueLocationName: string;

  @Field()
  locationLink: string;

  @Field({ nullable: true })
  hotelRanking: number;
}

@InputType()
export class CreateVenueInput extends AbstractState implements IVenue {
  @Field()
  name: string;

  @Field()
  shortDescription: string;

  @Field()
  description: string;

  @Field()
  thumbnail: string;

  @Field(() => EVenueType)
  venueCategory: EVenueType;

  @Field()
  venueInfo: VenueInfoInput;
}

registerEnumType(EVenueType, { name: 'EVenueType' });
