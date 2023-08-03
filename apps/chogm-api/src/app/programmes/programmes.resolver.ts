import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { stateFull } from '../users/utils/utils';
import { RatingInput } from '../utils/abstract/rating.input';
import { SpeakerSModerator } from '../utils/abstract/speakersmodurator.entity';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';
import { Programme } from './entities/programme.entity';
import { ProgrammesService } from './services/programmes.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Programme)
export class ProgrammesResolver {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Mutation(() => Programme)
  createProgramme(
    @CurrentUser() user: User,
    @Args('createProgrammeInput') createProgrammeInput: CreateProgrammeInput
  ) {
    return this.programmesService.create(createProgrammeInput, user._id);
  }

  @Mutation(() => Programme)
  updateProgramme(
    @CurrentUser() user: User,
    @Args('UpdateProgrammeInput') updateProgrammeInput: UpdateProgrammeInput
  ) {
    return this.programmesService.update(updateProgrammeInput, user._id);
  }

  @Mutation(() => Programme)
  rateProgramme(
    @Args('programmeId') id: string,
    @Args('RatingInput') ratingInput: RatingInput
  ) {
    return this.programmesService.rateProgramme(id, ratingInput);
  }

  @Query(() => [Programme], { nullable: true })
  programmes(@CurrentUser() user: User) {
    return this.programmesService.findAll(stateFull(user));
  }

  @Query(() => Programme)
  programme(@Args('id') id: string, @CurrentUser() user: User) {
    return this.programmesService.findOne(id, stateFull(user));
  }

  @Query(() => [Programme], {
    description: 'Query to fetch programms/sessions by forum id',
  })
  programmesByForum(@Args('forumId') id: string, @CurrentUser() user: User) {
    const ObjectId = Types.ObjectId;
    return this.programmesService.findBy({
      forum: new ObjectId(id),
      ...stateFull(user),
    });
  }

  @Query(() => SpeakerSModerator, {
    description: 'Query to fetch speakers by forum',
  })
  speakersByForum(@Args('forumId') id: string, @CurrentUser() user: User) {
    return this.programmesService.findSpeakersBy({
      forum: id,
      ...stateFull(user),
    });
  }

  @Query(() => [Programme], {
    description: 'Query to fetch programms/sessions by speaker/moderator id',
  })
  programmesByUser(@Args('userId') id: string, @CurrentUser() user: User) {
    const ObjectId = Types.ObjectId;
    return this.programmesService.findBy({
      $or: [{ speakers: new ObjectId(id) }, { moderator: new ObjectId(id) }],
      ...stateFull(user),
    });
  }
}
