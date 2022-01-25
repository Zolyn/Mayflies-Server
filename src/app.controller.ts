import {
  Controller,
  Get,
  Headers,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { UpyunService } from './services/upyun/upyun.service';
import { DirectoryMap, UpyunSdk } from './core/types';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
    private readonly upyunService: UpyunService,
  ) {}

  @Get()
  // async getFileList(): Promise<DirectoryMap> {
  //   const config = await this.appService.readConfig();
  //
  //   let result: DirectoryMap | null;
  //
  //   switch (config.storage) {
  //     case 'upyun': {
  //       const mergedStorageConfig = this.upyunService.mergeStorageConfig(
  //         config.storageConfig as UpyunSdk,
  //       );
  //
  //       result = await this.upyunService.retriveUpyunFileList(
  //         mergedStorageConfig,
  //         config.fullRetrive,
  //       );
  //     }
  //   }
  //
  //   return result;
  // }
  test(@Headers('x-real-ip') realIP: string) {
    return realIP;
  }
}
