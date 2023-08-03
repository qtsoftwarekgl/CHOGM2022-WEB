import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChogmLoginInput {
  @Field()
  email: string;

  @Field()
  qrdata: string;
}
