import { EChatType, EQAtypes } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  sender: string;

  @Field({ nullable: true })
  receiver: string;

  @Field()
  message: string;

  @Field(() => EQAtypes)
  queryType: EQAtypes;
}

@InputType()
export class NewChat {
  @Field(() => [String])
  users: string[];

  @Field(() => [NewMessage])
  messages: NewMessage[];

  @Field(() => EChatType)
  chatType: string;

  @Field(() => EQAtypes)
  queryType: string;
}

@InputType()
export class NewMessage {
  @Field(() => [String])
  sender: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  createdDate: string;
}

@InputType()
export class queryTypeInput {
  @Field(() => EQAtypes)
  queryType: string;
}

registerEnumType(EChatType, { name: 'EChatType' });
registerEnumType(EQAtypes, { name: 'EQAtypes' });
