import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReplyChatInput {
  @Field()
  chatId: string;

  @Field({ nullable: true })
  sender: string;

  @Field()
  message: string;
}
