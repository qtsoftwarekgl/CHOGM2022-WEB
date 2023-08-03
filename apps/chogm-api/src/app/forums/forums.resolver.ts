import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { stateFull } from '../users/utils/utils';
import { RatingInput } from '../utils/abstract/rating.input';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { Forum } from './entities/forum.entity';
import { ForumsService } from './services/forums.service';
@UseGuards(GqlAuthGuard)
@Resolver(() => Forum)
export class ForumsResolver {
  constructor(private readonly forumsService: ForumsService) {}

  @Mutation(() => Forum, { name: 'createForum' })
  async createForum(
    @Args('createForumInput') createForumInput: CreateForumInput,
    @CurrentUser() user: User
  ) {
    return await this.forumsService.create(createForumInput, user._id);
  }

  @Mutation(() => Forum, { name: 'updateForum' })
  async updateForum(
    @Args('createForumInput') updateForumInput: UpdateForumInput,
    @CurrentUser() user: User
  ) {
    return await this.forumsService.update(updateForumInput, user._id);
  }

  @Mutation(() => Forum, { name: 'registerToAttendForum' })
  async registerToAttendForum(
    @Args('userId') userid: string,
    @Args('forumId') forumId: string
  ) {
    return await this.forumsService.registerToAttend(userid, forumId);
  }

  @Mutation(() => Forum)
  rateForum(
    @Args('forumId') id: string,
    @Args('RatingInput') rating: RatingInput
  ) {
    return this.forumsService.rateForum(id, rating);
  }

  @Query(() => [Forum], { name: 'forums' })
  forums(@CurrentUser() user: User) {
    return this.forumsService.findAll(stateFull(user));
  }

  @Query(() => Forum)
  forum(@Args('id') id: string, @CurrentUser() user: User) {
    return this.forumsService.findOne(id, stateFull(user));
  }

  @Query(() => [Forum])
  async forumsByvenue(
    @Args('venueId') venueId: string,
    @CurrentUser() user: User
  ) {
    const venue = await this.forumsService.checkVenue(venueId);
    if (!venue) return;
    return await this.forumsService.findAllBy({
      venue: venueId,
      ...stateFull(user),
    });
  }
}
