import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GqlAuthGuard } from '../auth/auth.guard';
import { PUB_SUB } from '../config/pub-sub.module';
import { AmenitiesInput } from '../rooms/dto/create-room.input';
import { Room } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/services/rooms.service';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { BOOKING_REQUEST_EVENT } from '../utils/events';
import { CreateBookingInput } from './dto/create-booking.input';
import { DateRangeInput } from './dto/date-range-room.input';
import { ApproveBookingInput } from './dto/update-booking.input';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './services/bookings.service';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly roomsService: RoomsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Booking)
  async createBooking(
    @Args('CreateBookingInput') createBookingInput: CreateBookingInput
  ) {
    return await this.bookingsService.create(createBookingInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Booking, { description: 'Api for admin to approve booking' })
  approveBooking(
    @Args('ApproveBookingInput') updateBookingInput: ApproveBookingInput,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.update(updateBookingInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Booking], { name: 'bookings' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Room], { name: 'availableRooms' })
  availableRooms(@CurrentUser() user: User) {
    return this.bookingsService.findAllAvailableRooms(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Booking, { name: 'booking' })
  async findOne(@Args('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Query(() => [Room], {
    description: 'Query to fetch rooms by amenities filter object',
  })
  roomByAmenities(
    @Args('AmenitiesInput') amenities: AmenitiesInput,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.findAllByAmenities(amenities, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Room], {
    description: 'Query to fetch rooms by date range filter object',
  })
  availableRoomsDateRange(
    @Args('dateRangeInput') dates: DateRangeInput,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.findAllRoomsByDate(dates, user);
  }

  @Subscription(() => Booking, { name: 'bookingRequestEvent' })
  bookingRequestEvent() {
    return this.pubSub.asyncIterator<Booking>(BOOKING_REQUEST_EVENT);
  }
}
