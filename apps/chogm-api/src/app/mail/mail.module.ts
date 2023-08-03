import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../../environments/environment';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: environment.mail_host,
        port: 465,
        secure: true,
        debug: false,
        logger: false,
        auth: {
          user: environment.mail_username,
          pass: environment.mail_password,
        },
      },
      defaults: {
        from: `No Reply <${environment.mail_username}>`,
      },
    }),
    HttpModule.register({
      maxRedirects: 5,
      headers: {
        'x-auth': environment.chogm_api_cms_x_auth,
        'app-version': environment.chogm_api_version,
        'app-device': environment.chogm_api_device,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
