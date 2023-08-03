import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../../environments/environment';
import { AuthModule } from '../auth/auth.module';
import { CmsResolver } from './cms.resolver';
import { Cms, CmsSchema } from './entities/cms.entity';
import { CmsService } from './services/cms.service';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      headers: {
        'x-auth': environment.chogm_api_cms_x_auth,
        'app-version': environment.chogm_api_version,
        'app-device': environment.chogm_api_device,
      },
    }),
    MongooseModule.forFeature([{ name: Cms.name, schema: CmsSchema }]),
    AuthModule,
  ],
  providers: [CmsResolver, CmsService],
})
export class CmsModule {}
