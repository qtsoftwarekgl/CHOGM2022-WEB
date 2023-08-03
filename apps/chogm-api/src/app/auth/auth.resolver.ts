import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserLoginInput } from '../auth/dto/user-login.input';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { GqlAuthGuard } from './auth.guard';
import { ChogmLoginInput } from './dto/chogm-login.input';
import { ConvidResult } from './dto/covid-result.input';
import { UserToken } from './dto/user-token.input';
import { AuthService } from './service/auth.service';
import { ChogmIntegrationService } from './service/integration.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly integration: ChogmIntegrationService
  ) {}

  @Mutation(() => UserToken)
  UserLogin(@Args('UserLoginInput') userLoginInput: UserLoginInput) {
    return this.authService.login(userLoginInput);
  }

  @Mutation(() => UserToken)
  chogmLogin(@Args('ChogmLoginInput') chogmLoginInput: ChogmLoginInput) {
    return this.integration.login(chogmLoginInput);
  }

  @Mutation(() => Boolean)
  generateOtp(@Args('email') email: string) {
    return this.integration.generateOTP(email);
  }

  @Mutation(() => UserToken)
  otpLogin(@Args('email') email: string, @Args('otp') otp: string) {
    return this.integration.loginOTP(email, otp);
  }

  @Mutation(() => Boolean)
  resetPassword(
    @Args('verificationCode') verificationCode: number,
    @Args('newPassword') newPassword: string
  ) {
    return this.authService.resetPwd(verificationCode, newPassword);
  }

  @Mutation(() => Boolean)
  verifyEmail(@Args('email') email: string) {
    return this.authService.verifyEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ConvidResult)
  covidResult(@CurrentUser() user: User) {
    return this.integration.fetchCovidResults(user);
  }
}
