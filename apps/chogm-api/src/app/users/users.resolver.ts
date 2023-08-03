import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';
import { RatingInput } from '../utils/abstract/rating.input';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserIdsInput } from './dto/user-ids.input';
import { RolesInput } from './dto/user-role.input';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { stateFull } from './utils/utils';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser() user: User
  ) {
    return this.usersService.create(createUserInput, user._id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('UpdateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User
  ) {
    return this.usersService.update(updateUserInput, user._id);
  }

  @Mutation(() => User)
  rateUser(
    @Args('userId') id: string,
    @Args('RatingInput') rating: RatingInput
  ) {
    return this.usersService.rateUser(id, rating);
  }

  @Mutation(() => User)
  deviceRegistrationToken(
    @Args('userId') id: string,
    @Args('registrationId') token: string
  ) {
    return this.usersService.registerDevice(id, token);
  }

  @Query(() => [User])
  users(@Args('skip') skip: number, @Args('limit') limit: number) {
    return this.usersService.findAll(skip, limit);
  }

  @Query(() => [User])
  usersSearch(@Args('searchInput') input: string) {
    return this.usersService.search(input);
  }

  @Query(() => Number)
  usersCount() {
    return this.usersService.count();
  }

  @Query(() => User)
  user(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => [User], { description: 'query users by user role' })
  usersByRole(
    @Args('RoleInput') roleInput: RolesInput,
    @CurrentUser() user: User
  ) {
    return this.usersService.findAllBy({
      role: { $in: roleInput.roles },
      ...stateFull(user),
    });
  }

  @Query(() => [User], { description: 'query users by array of user ids' })
  usersByIds(@Args('UserIdsInput') ids: UserIdsInput) {
    return this.usersService.findAllByIds(ids.userIds);
  }
}
