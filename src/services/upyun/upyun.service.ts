import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as upyun from 'upyun';
import { join } from 'path';
import { DirectoryMap, FileMeta, FileMetaList, UpyunSdk } from '~/core/types';
import {
  awaitHelper,
  getFileTypeAndIcon,
  transformTime,
  transformBytes,
} from '~/core/utils';

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
export class UpyunService {
  mergeStorageConfig(config: UpyunSdk | undefined): UpyunSdk {
    const envs: UpyunSdk = {
      service: process.env.UPYUN_SERVICE,
      operator: process.env.UPYUN_OPERATOR,
      password: process.env.UPYUN_PASSWORD,
    };

    // @ts-ignore
    const mergedConfig: UpyunSdk = {};

    Object.keys(envs).map((key) => {
      let mergedValue = envs[key];
      if (config) {
        mergedValue = envs[key] ?? config[key];
      }

      if (!mergedValue) {
        throw new InternalServerErrorException(`Missing config prop: ${key}`);
      }

      mergedConfig[key] = mergedValue;
    });

    return mergedConfig;
  }

  async retriveUpyunFileList(
    config: UpyunSdk,
    fullRetrieve: boolean,
  ): Promise<DirectoryMap> {
    const { service, operator, password } = config;
    const instance = new upyun.Service(service, operator, password);

    const client = new upyun.Client(instance);

    const dirMap: DirectoryMap = {};

    async function getDirectoryMap(path: string): Promise<void> {
      const fileMetaList: FileMetaList = [];
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
        const { type, icon } = getFileTypeAndIcon(name);

        const fileMeta: FileMeta = {
          isDir: false,
          pathname: name,
          transformedTime: transformTime(time),
          transformedSize: transformBytes(size),
          type,
          icon,
          time,
          size,
        };

        if (fileIdentifier === 'F' && fullRetrieve) {
          const fullPath = join(path, name);
          await getDirectoryMap(fullPath);

          fileMeta.isDir = true;
          fileMeta.icon = 'folder';
          fileMeta.type = 'folder';
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
