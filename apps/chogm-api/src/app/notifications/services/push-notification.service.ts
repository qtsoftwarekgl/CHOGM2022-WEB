import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PushNotificationsService {
  private readonly fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  private readonly expoUrl = 'https://exp.host/--/api/v2/push/send';

  constructor(private httpService: HttpService) {}

  public async sendToDevice(token: string, payload: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(this.fcmUrl, { to: token, ...payload })
    );
    return data;
  }

  //todo: remove, for testing in prod purpose
  public async sendTopic(topic: string, payload: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(this.fcmUrl, {
        to: '/topics/' + topic,
        ...payload,
      })
    );

    return data;
  }

  public async sendToDevicesExpo(
    token: string[] | any[],
    payload: any
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(this.expoUrl, { to: token, ...payload })
    );
    return data;
  }
}
