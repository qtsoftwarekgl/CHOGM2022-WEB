import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { stateFull } from '../users/utils/utils';
import { RatingInput } from '../utils/abstract/rating.input';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { CreateVenueInput } from './dto/create-venue.input';
import { UpdateVenueInput } from './dto/update-venue.input';
import { VenueCategoryInput } from './dto/venue-category.input';
import { Venue } from './entities/venue.entity';
import { VenuesService } from './services/venues.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Venue)
export class VenuesResolver {
  constructor(private readonly venuesService: VenuesService) {}

  @Mutation(() => Venue)
  createVenue(
    @Args('createVenueInput') createVenueInput: CreateVenueInput,
    @CurrentUser() user: User
  ) {
    return this.venuesService.create(createVenueInput, user._id);
  }

  @Mutation(() => Venue)
  updateVenue(
    @Args('UpdateVenueInput') updateVenueInput: UpdateVenueInput,
    @CurrentUser() user: User
  ) {
    return this.venuesService.update(updateVenueInput, user._id);
  }

  @Mutation(() => Venue)
  rateVenue(
    @Args('venueId') id: string,
    @Args('RatingInput') rating: RatingInput
  ) {
    return this.venuesService.rateVenue(id, rating);
  }

  @Query(() => [Venue])
  venues(@CurrentUser() user: User) {
    return this.venuesService.findAll(stateFull(user));
  }

  @Query(() => [Number])
  takenRanks(
    @Args('VenueCategoryInput') venuCategoryInput: VenueCategoryInput
  ) {
    return this.venuesService.findAvailableRanking(venuCategoryInput);
  }

  @Query(() => Venue)
  venue(@Args('id') id: string, @CurrentUser() user: User) {
    return this.venuesService.findOne(id, stateFull(user));
  }

  @Query(() => [Venue])
  venuesByCategoy(
    @Args('VenueCategoryInput') venuCategoryInput: VenueCategoryInput,
    @CurrentUser() user: User
  ) {
    return this.venuesService.findAllBy({
      venueCategory: venuCategoryInput.category,
      ...stateFull(user),
    });
  }
}
