import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class UserToken {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}
