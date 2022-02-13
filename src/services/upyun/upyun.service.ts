import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as upyun from 'upyun';
import { join } from 'path';
import {
  PlainDirectoryMap,
  PlainFileMeta,
  PlainFileMetaList,
  ResolvedProviderConfig,
  StorageService,
  UpyunConfig,
} from '~/core/types';
import { awaitHelper, mergeConfigAndEnv } from '~/core/utils';

interface USSListFile {
  name: string;
  type: 'N' | 'F';
  size: number;
  time: number;
}

interface USSListResult {
  files: USSListFile[];
  next: string;
}

@Injectable()
export class UpyunService implements StorageService {
  async main({
    providerConfig,
    fullRetrieve,
  }: ResolvedProviderConfig): Promise<PlainDirectoryMap> {
    return await this.retrieveUpyunFileList(
      this.mergeProviderConfig(providerConfig as UpyunConfig),
      fullRetrieve,
    );
  }

  mergeProviderConfig(config: UpyunConfig): UpyunConfig {
    const envs: UpyunConfig = {
      service: process.env.UPYUN_SERVICE,
      operator: process.env.UPYUN_OPERATOR,
      password: process.env.UPYUN_PASSWORD,
    };

    return mergeConfigAndEnv('upyunService', config, envs);
  }

  async retrieveUpyunFileList(
    config: UpyunConfig,
    fullRetrieve: boolean,
  ): Promise<PlainDirectoryMap> {
    const { service, operator, password } = config;
    const instance = new upyun.Service(service, operator, password);

    const client = new upyun.Client(instance);

    const dirMap: PlainDirectoryMap = {};

    async function getDirectoryMap(path: string): Promise<void> {
      const fileMetaList: PlainFileMetaList = [];
      const [err, currentFiles] = await awaitHelper<USSListResult | false>(
        client.listDir(path),
      );

      if (!currentFiles) {
        if (typeof currentFiles === 'boolean') {
          throw new InternalServerErrorException('No such file or directory');
        }

        throw new InternalServerErrorException(err);
      }

      for (const {
        type: fileIdentifier,
        name,
        time,
        size,
      } of currentFiles.files) {
        const fileMeta: PlainFileMeta = {
          isDir: false,
          pathname: name,
          time,
          size,
        };

        if (fileIdentifier === 'F' && fullRetrieve) {
          const fullPath = join(path, name);
          await getDirectoryMap(fullPath);

          fileMeta.isDir = true;
        }

        fileMetaList.push(fileMeta);
      }

      dirMap[path] = {
        pathname: path,
        files: fileMetaList,
      };
    }

    await getDirectoryMap('/');
    return dirMap;
  }
}
