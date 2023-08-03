import { IRoom, IRoomAmenities } from '@chogm2022/interfaces';
import { Field, InputType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class AmenitiesInput implements IRoomAmenities {
  @Field()
  conditioner: boolean;

  @Field()
  wifi: boolean;

  @Field()
  microphone: boolean;

  @Field()
  projector: boolean;

  @Field()
  camera: boolean;
}

@InputType()
export class CreateRoomInput extends AbstractState implements IRoom {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  thumbnail: string;

  @Field()
  venue: string;

  @Field(() => AmenitiesInput)
  amenities: AmenitiesInput;

  @Field(() => Number)
  capacity: number;

  @Field(() => Boolean)
  bookable: boolean;

  @Field(() => Boolean)
  isMediaRoom: boolean;
}
