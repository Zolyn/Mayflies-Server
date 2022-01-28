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
import { DirectoryMap } from './core/types';
import { UpyunConfig } from '~/core/utils';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
    private readonly upyunService: UpyunService,
  ) {}

  @Get()
  async getFileList(
    @Headers('x-real-ip') realIP: string,
  ): Promise<DirectoryMap> {
    const cache: DirectoryMap = await this.cacheManager.get(realIP);

    if (cache) {
      console.log(`Sending cache for ${realIP}`);
      return cache;
    }

    const config = await this.appService.readConfig();

    let result: DirectoryMap | null;

    switch (config.storage) {
      case 'upyun': {
        const mergedStorageConfig = this.upyunService.mergeStorageConfig(
          (config as UpyunConfig).storageConfig,
        );

        result = await this.upyunService.retriveUpyunFileList(
          mergedStorageConfig,
          config.fullRetrieve,
        );
      }
    }

    return await this.cacheManager.set(realIP, result, { ttl: 60 });
  }
}
