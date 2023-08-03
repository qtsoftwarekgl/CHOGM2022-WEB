import { EStatus } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class ApproveBookingInput {
  @Field()
  bookingId: string;

  @Field(() => EStatus)
  status: EStatus;

  @Field({ nullable: true })
  room: string;

  @Field({ nullable: true })
  message: string;
}

registerEnumType(EStatus, { name: 'EStatus' });
