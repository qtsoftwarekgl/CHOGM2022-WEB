import { EVenueType } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class VenueCategoryInput {
  @Field(() => EVenueType)
  category: EVenueType;
}

registerEnumType(EVenueType, { name: 'EVenueType' });
