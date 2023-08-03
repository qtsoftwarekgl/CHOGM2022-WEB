import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  accountCreatedTempl,
  bookingTempl,
  verifyAccountTempl,
} from './templates/email.templates';

@Injectable()
export class MailService {
  private readonly mailUrl = environment.chogm_cms_api_url + '/send-mail';
  constructor(
    private mailerService: MailerService,
    private httpService: HttpService
  ) {}

  async accountCreatedSendMail(user: any, url: string) {
    const name = user.firstName + ' ' + user.lastName;
    const mailPayload = {
      to_email_address: user.email,
      email_subject: 'Account Created!',
      email_body: accountCreatedTempl(name, url),
    };
    this.sendEmail(mailPayload);
  }

  async accountResetSendMail(user: any, url: string) {
    const name = user.firstName + ' ' + user.lastName;
    const mailPayload = {
      to_email_address: user.email,
      email_subject: 'Password Reset!',
      email_body: verifyAccountTempl(name, url),
    };
    this.sendEmail(mailPayload);
  }

  async bookingActionSendMail(user: any, title: string, message: string) {
    const name = user.firstName + ' ' + user.lastName;
    const mailPayload = {
      to_email_address: user.email,
      email_subject: title,
      email_body: bookingTempl(name, title, message),
    };
    this.sendEmail(mailPayload);
  }

  async sendEmail(payload: any) {
    await firstValueFrom(this.httpService.post(this.mailUrl, payload));
  }
}
