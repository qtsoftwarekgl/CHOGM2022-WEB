import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSeenNotificationInput {
  @Field(() => [String])
  notificationIds: string[];
}
