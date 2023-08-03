import {
  DateScalarMode,
  Field,
  GraphQLISODateTime,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class DateRangeInput {
  @Field(() => GraphQLISODateTime)
  startDate: DateScalarMode;

  @Field(() => GraphQLISODateTime)
  endDate: DateScalarMode;
}
