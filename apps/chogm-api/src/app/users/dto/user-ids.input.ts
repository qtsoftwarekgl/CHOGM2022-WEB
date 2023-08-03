import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserIdsInput {
  @Field(() => [String])
  userIds: string[];
}
