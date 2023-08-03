import { IForum } from '@chogm2022/interfaces';
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class CreateForumInput extends AbstractState implements IForum {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  thumbnail: string;

  @Field()
  venue: string;

  @Field({ defaultValue: true })
  status: boolean;

  @Field(() => [String], { nullable: true })
  attendees: string[];

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;
}
