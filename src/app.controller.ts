import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UpyunService } from './services/upyun/upyun.service';
import { DirectoryMap, UpyunSdk } from './core/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly upyunService: UpyunService,
  ) {}

  @Get()
  async getFileList(): Promise<DirectoryMap> {
    const config = await this.appService.readConfig();

    let result: DirectoryMap | null;

    switch (config.storage) {
      case 'upyun': {
        const mergedStorageConfig = this.upyunService.mergeStorageConfig(
          config.storageConfig as UpyunSdk,
        );

        result = await this.upyunService.retriveUpyunFileList(
          mergedStorageConfig,
          config.fullRetrive,
        );
      }
    }

    return result;
  }
}
