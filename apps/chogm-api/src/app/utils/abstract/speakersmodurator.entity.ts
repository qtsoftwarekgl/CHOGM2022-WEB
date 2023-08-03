import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class SpeakerSModerator {
  @Field(() => [User])
  @Prop()
  speakers: User[];

  @Field(() => [User])
  @Prop()
  moderators: User[];
}
