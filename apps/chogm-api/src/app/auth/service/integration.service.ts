import { EGender, ENotificationType, EUserRole } from '@chogm2022/enums';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PUB_SUB } from '../../config/pub-sub.module';
import { Notification } from '../../notifications/entities/notification.entity';
import { User } from '../../users/entities/user.entity';
import { USER_NOTIFICATION_EVENT } from '../../utils/events';
import { _idToid } from '../../utils/id-reviver';
import messages from '../../utils/messages';
import { ChogmLoginInput } from '../dto/chogm-login.input';
import { ConvidResult } from '../dto/covid-result.input';
import { UserToken } from '../dto/user-token.input';
import { AuthService } from './auth.service';
@Injectable()
export class ChogmIntegrationService {
  baseUrl = environment.chogm_api_url;
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    @InjectModel(Notification.name)
    private readonly notificationRepo: Model<Notification>,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  // login api
  async login(request: ChogmLoginInput): Promise<UserToken> {
    try {
      const url = this.baseUrl + '/qr-login';
      const { email, qrdata } = request;

      const result = await firstValueFrom(
        this.httpService.post(url, { email: email, qrdata: qrdata })
      );

      const findUser = await this.userRepository.findOne({ email });

      if (result?.status === 200) {
        const apiData = this.userData(result.data?.data);
        let user;

        if (findUser?.email || findUser?.accreditationId) {
          if (!findUser?.state) {
            throw new HttpException(
              messages.ACCOUNT_DEACTIVATED,
              HttpStatus.BAD_REQUEST
            );
          }

          apiData.role = findUser.role;
          user = await this.userRepository
            .findOneAndUpdate({ email }, apiData, { new: true })
            .exec();
        } else {
          user = await new this.userRepository(apiData).save();
        }

        const newResults = result.data?.data?.covid_result;

        if (this.checkCovidUpdate(findUser?.covidResult, newResults)) {
          this.updateCovidResults(newResults, user.id.toString());
        }

        return {
          user: user,
          token: this.authService.createToken(user.id.toString()),
        };
      } else {
        throw new HttpException(messages.USER_DOESNT_EXIT, HttpStatus.CONFLICT);
      }
    } catch (ex) {
      this.extractErrors(ex.message);
    }
  }

  // generate otp api
  async generateOTP(email: string): Promise<boolean> {
    try {
      const url = this.baseUrl + '/otp-generate&email=' + email;
      // todo: remove this as it's for apple to test
      if (email === environment.apple_test_user) {
        return false;
      }
      const { data } = await firstValueFrom(this.httpService.get(url));

      if (data?.status === 200) {
        return data?.status === 200;
      } else {
        throw new HttpException(messages.USER_DOESNT_EXIT, HttpStatus.CONFLICT);
      }
    } catch (ex) {
      this.extractErrors(ex.message);
    }
  }

  // login otp api
  async loginOTP(email: string, otp: string): Promise<UserToken> {
    try {
      const url = this.baseUrl + '/otp-login&email=' + email + '&otp=' + otp;
      const testUser = environment.apple_test_user;
      const { data } =
        testUser !== email
          ? await firstValueFrom(this.httpService.get(url))
          : { data: null };
      let user: User;
      if (data?.status === 200 || testUser === email) {
        const found = await this.userRepository.findOne({ email: email });

        if (testUser === email) {
          user = found;
        } else {
          if (found?.accreditationId || found?.email) {
            if (!found?.state) {
              throw new HttpException(
                messages.ACCOUNT_DEACTIVATED,
                HttpStatus.BAD_REQUEST
              );
            }

            const newData = this.userData(data.data);
            newData.role = found.role;

            user = await this.userRepository
              .findOneAndUpdate({ email }, newData, { new: true })
              .exec();
          } else {
            user = await new this.userRepository(
              this.userData(data?.data)
            ).save();
          }
        }

        const newResults = data?.data?.covid_result;

        if (this.checkCovidUpdate(found?.covidResult, newResults)) {
          this.updateCovidResults(newResults, user.id.toString());
        }

        return {
          user: user,
          token: this.authService.createToken(user?.id.toString()),
        };
      } else {
        throw new HttpException(data?.message, HttpStatus.CONFLICT);
      }
    } catch (ex) {
      this.extractErrors(ex.message, true);
    }
  }

  async fetchCovidResults(user: User): Promise<ConvidResult> {
    try {
      const { id, email, qrcodeData, covidResult } = user;

      if (email && qrcodeData) {
        const url = this.baseUrl + '/qr-login';

        const { data } = await firstValueFrom(
          this.httpService.post(url, { email, qrdata: qrcodeData })
        );

        const { covid_result } = data.data;
        if (this.checkCovidUpdate(covidResult, covid_result)) {
          return this.updateCovidResults(covid_result, id.toString());
        } else {
          return covidResult;
        }
      }
    } catch (ex) {
      this.extractErrors(ex.message);
    }
  }

  async updateCovidResults(
    newResults: any,
    userId: string
  ): Promise<ConvidResult> {
    const covidResult = {
      testResult: newResults?.test_result,
      testType: newResults?.test_type,
      testDate: newResults?.test_date,
    };

    const update = await this.userRepository
      .findOneAndUpdate({ _id: userId }, { covidResult }, { new: true })
      .exec();

    await this.saveCovidResult(userId, covidResult);
    return update.covidResult;
  }

  async saveCovidResult(id: string, data: any) {
    if (data?.testResult) {
      const content = `You tested ${data.testResult} on covid-19 on ${data.testDate}`;

      const notification = await new this.notificationRepo({
        ...{
          type: ENotificationType.COVID_RESULT,
          content,
          userId: null,
          payload: {
            payloadId: 'covid_result',
            title: 'Covid-19 test results',
          },
        },
        receiverId: id,
      }).save();

      this.pubSub.publish(USER_NOTIFICATION_EVENT, {
        userNotificationEvent: _idToid(notification),
      });
    }
  }

  checkCovidUpdate(oldResults: any, newResults: any): boolean {
    return (
      !newResults?.test_result ||
      oldResults?.testType !== newResults?.test_type ||
      oldResults?.testResult !== newResults?.test_result ||
      (oldResults?.testResult &&
        new Date(newResults?.test_date) > new Date(oldResults?.testDate))
    );
  }

  // return a well formatted User from chogm-api
  userData(apiData: any) {
    return {
      firstName: apiData.participant_firstname || null,
      lastName: apiData.participant_lastname || null,
      dateOfBirth: apiData.participant_dob || null,
      gender:
        apiData.participant_gender === '0' ? EGender.FEMALE : EGender.MALE,
      email: apiData.participant_email || null,
      phoneNumber: apiData.participant_phone || null,
      avatar: apiData.participant_profile_photo_url,
      qrcodeData: apiData.participant_badge_qrcode,
      passport: apiData.participant_passport || null,
      nationality: apiData.participant_nationality || null,
      occupation: apiData.participant_occupation || null,
      residenceCountry: apiData.participant_country_residence || null,
      category: apiData.participant_category || null,
      company: apiData.participant_company || null,
      role: [EUserRole.ATTENDEE],
      identity: {
        identityType: apiData.participant_identity_type,
        identityNumber: apiData.participant_identity_number,
      },
      events: apiData.events?.map(({ event_id }) => event_id),
      accreditationId: apiData.participant_id,
      accreditationToken: apiData.token,
      covidResult: {
        testResult: apiData.covid_result?.test_result,
        testType: apiData.covid_result?.test_type,
        testDate: apiData.covid_result?.test_date,
      },
    };
  }

  extractErrors(error: string, isOtpLogin = false): void {
    if (
      error?.includes(`${HttpStatus.FORBIDDEN}`) ||
      error?.includes(`${HttpStatus.NOT_FOUND}`)
    ) {
      throw new HttpException(
        !isOtpLogin ? messages.ACCOUNT_NOT_FOUND : messages.INVALID_OTP,
        HttpStatus.NOT_FOUND
      );
    }
    if (error?.includes(`${HttpStatus.INTERNAL_SERVER_ERROR}`)) {
      throw new HttpException(
        messages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (
      error?.includes(`${HttpStatus.BAD_GATEWAY}`) ||
      error?.includes(`${HttpStatus.SERVICE_UNAVAILABLE}`)
    ) {
      throw new HttpException(
        messages.SERVICE_UNAVAILABLE,
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
