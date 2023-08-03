import { JwtPayload } from '@chogm2022/interfaces';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { environment } from '../../../environments/environment';
import { MailService } from '../../mail/mail.service';
import { User } from '../../users/entities/user.entity';
import { expiryDate, localDate } from '../../utils/abstract/utils';
import messages from '../../utils/messages';
import { UserLoginInput } from '../dto/user-login.input';
import { UserToken } from '../dto/user-token.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    private readonly mailService: MailService
  ) {}

  createToken(id: string): string {
    return jwt.sign({ id }, environment.jwt_secret);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userRepository.findById(payload.id);
  }

  async login(userLoginInput: UserLoginInput): Promise<UserToken> {
    const user = await this.userRepository.findOne({
      email: userLoginInput.email,
    });
    if (!user?.email) {
      throw new HttpException(
        messages.USER_DOESNT_EXIT,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!user?.state) {
      throw new HttpException(
        messages.ACCOUNT_DEACTIVATED,
        HttpStatus.BAD_REQUEST
      );
    }
    const isValid = await bcrypt.compare(
      userLoginInput.password,
      user.password
    );
    if (isValid) {
      return { user, token: this.createToken(user.id.toString()) };
    } else {
      throw new HttpException(
        messages.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async verifyEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      email,
    });
    if (!user?.email) {
      throw new HttpException(
        messages.USER_DOESNT_EXIT,
        HttpStatus.BAD_REQUEST
      );
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const update = await this.userRepository
      .findOneAndUpdate(
        {
          email,
        },
        {
          verificationCode: {
            code: verificationCode,
            expiryDate: expiryDate(),
          },
        },
        { new: true }
      )
      .exec();

    const url = environment.chogm_cms_ui + verificationCode;

    this.mailService.accountResetSendMail(user, url);
    return !!update;
  }

  async resetPwd(verificationCode: number, newPwd: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      'verificationCode.code': verificationCode,
    });
    if (!user) {
      throw new HttpException(
        messages.VERIFICATION_CODE_INVALID,
        HttpStatus.BAD_REQUEST
      );
    } else {
      const { expiryDate } = user.verificationCode;
      if (
        expiryDate &&
        expiryDate !== null &&
        localDate(new Date()) > localDate(new Date(expiryDate))
      ) {
        throw new HttpException(
          messages.VERIFICATION_CODE_EXPIRED,
          HttpStatus.BAD_REQUEST
        );
      }

      const password = await bcrypt.hash(newPwd, 10);
      const update = this.userRepository
        .findOneAndUpdate(
          { _id: user.id },
          { password },
          {
            new: true,
          }
        )
        .exec();
      return !!update;
    }
  }
}
