import { Controller, Get, Headers, Ip } from '@nestjs/common';
import { AppService } from './app.service';
import { UpyunService } from './services';
import { PlainDirectoryMap } from './core/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly upyunService: UpyunService,
  ) {}

  @Get('upyun')
  async upyun(
    @Ip() ip: string,
    @Headers('x-real-ip') xRealIP: string,
  ): Promise<PlainDirectoryMap> {
    return await this.appService.tryGetCache(
      xRealIP ?? ip,
      this.upyunService,
      await this.appService.getProviderConfig('upyun'),
    );
  }
}
