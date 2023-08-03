import { ENotificationType } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { CreatedBy } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class CreatePayload {
  @Field()
  payloadId: string;

  @Field()
  from: string;

  @Field({ nullable: true })
  title?: string;
}

@InputType()
export class CreateNotificationInput {
  @Field()
  content: string;

  @Field(() => CreatePayload)
  payload: CreatePayload;

  @Field(() => String)
  userId: string;

  @Field(() => ENotificationType)
  type: string;
}

registerEnumType(ENotificationType, { name: 'ENotificationType' });
