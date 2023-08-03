import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { AmenitiesInput, CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { Room } from './entities/room.entity';
import { RoomsService } from './services/rooms.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room)
  createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
    @CurrentUser() user: User
  ) {
    return this.roomsService.create(createRoomInput, user._id);
  }

  @Mutation(() => Room)
  updateRoom(
    @Args('UpdateRoomInput') updateRoomInput: UpdateRoomInput,
    @CurrentUser() user: User
  ) {
    return this.roomsService.updateRoom(updateRoomInput, user._id);
  }

  @Query(() => [Room])
  rooms() {
    return this.roomsService.findAll();
  }

  @Query(() => Room)
  room(@Args('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Query(() => [Room], { description: 'Query to fetch rooms by venueId' })
  async roomsByAvenue(@Args('venueId') venueId: string) {
    const venue = await this.roomsService.checkVenue(venueId);
    if (!venue) return;
    return this.roomsService.findBy({ venue: venueId });
  }
}
