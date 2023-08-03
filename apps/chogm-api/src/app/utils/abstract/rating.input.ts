import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RatingInput {
  @Field(() => Number)
  rate: number;

  @Field()
  user: string;

  @Field()
  comment: string;

  @Field(() => String, { nullable: true })
  createdDate: string;
}
