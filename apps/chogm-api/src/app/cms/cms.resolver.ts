import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ECMSTypes } from '@chogm2022/enums';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../users/entities/user.entity';
import { stateFull } from '../users/utils/utils';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { CmsCategoryInput } from './dto/cms-category.input';
import { AllStats } from './dto/cms-stat';
import { CreateCmsInput } from './dto/create-cms.input';
import { UpdateCmsInput } from './dto/update-cms.input';
import { Cms } from './entities/cms.entity';
import { CmsService } from './services/cms.service';

@Resolver(() => Cms)
export class CmsResolver {
  constructor(private readonly cmsService: CmsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Cms)
  createCms(
    @Args('CreateCmsInput') createCmInput: CreateCmsInput,
    @CurrentUser() user: User
  ) {
    return this.cmsService.create(createCmInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Cms)
  updateCms(
    @Args('UpdateCmsInput') updateCmsInput: UpdateCmsInput,
    @CurrentUser() user: User
  ) {
    return this.cmsService.update(updateCmsInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Cms], { name: 'allCms' })
  allCms(@CurrentUser() user: User) {
    return this.cmsService.findAll(stateFull(user));
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Cms)
  cms(@Args('id') id: string, @CurrentUser() user: User) {
    return this.cmsService.findOne(id, stateFull(user));
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Cms])
  cmsByCategory(
    @Args('CmsCategoryInput') cmsCategoryInput: CmsCategoryInput,
    @CurrentUser() user: User
  ) {
    return this.cmsService.findBy({
      category: cmsCategoryInput.category,
      ...stateFull(user),
    });
  }

  @Query(() => [Cms], { name: 'news' })
  getAllNews() {
    return this.cmsService.findNews();
  }

  @Query(() => Cms, { name: 'aboutConference' })
  getAboutConference() {
    return this.cmsService.findByCategory(ECMSTypes.ABOUT_CONFERENCE);
  }

  @Query(() => AllStats, { name: 'cmsStats' })
  getCmsStats() {
    return this.cmsService.getStats();
  }

  @Query(() => Cms, { name: 'privacyPolicy' })
  privacyPolicy() {
    return this.cmsService.findByCategory(ECMSTypes.PRIVACY_POLICY);
	}
	
	@Query(() => Cms, { name: 'tollNumber' })
  tollNumber() {
    return this.cmsService.findByCategory(ECMSTypes.TOLL_NUMBER);
  }
}
