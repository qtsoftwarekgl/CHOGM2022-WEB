import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateForumInput } from './create-forum.input';

@InputType()
export class UpdateForumInput extends PartialType(CreateForumInput) {
  @Field()
  forumId: string;
}
