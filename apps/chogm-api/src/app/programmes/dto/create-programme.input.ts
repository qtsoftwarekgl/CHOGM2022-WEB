import { IProgramme } from '@chogm2022/interfaces';
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class CreateProgrammeInput extends AbstractState implements IProgramme {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  room: string;

  @Field()
  forum: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field(() => [String])
  speakers: string[];

  @Field(() => [String])
  moderator: string[];

  @Field({ nullable: true })
  broadcastLink: string;
}
