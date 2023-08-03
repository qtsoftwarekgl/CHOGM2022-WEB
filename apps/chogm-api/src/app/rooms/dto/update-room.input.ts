import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRoomInput } from './create-room.input';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {
  @Field()
  roomId: string;
}
