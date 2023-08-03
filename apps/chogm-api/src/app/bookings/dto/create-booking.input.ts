import { IBooking } from '@chogm2022/interfaces';
import {
  DateScalarMode,
  Field,
  GraphQLISODateTime,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class CreateBookingInput implements IBooking {
  @Field()
  user: string;

  @Field()
  room: string;

  @Field(() => GraphQLISODateTime)
  startDate: DateScalarMode;

  @Field(() => GraphQLISODateTime)
  endDate: DateScalarMode;
}
