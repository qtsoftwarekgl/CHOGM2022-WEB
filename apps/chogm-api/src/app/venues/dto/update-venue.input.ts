import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateVenueInput } from './create-venue.input';

@InputType()
export class UpdateVenueInput extends PartialType(CreateVenueInput) {
  @Field()
  venueId: string;
}
