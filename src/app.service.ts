import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { awaitHelper } from './core/utils';
import { EphemeresConfig, UpyunSdk } from './core/types';

@Injectable()
export class AppService {
  async readConfig(): Promise<EphemeresConfig> {
    // @ts-ignore
    const [_, val] = await awaitHelper(import('./core/config'));

    const envs: EphemeresConfig = {
      storage: process.env.EPH_STORAGE,
      host: process.env.EPH_HOST,
      fullRetrieve: process.env.EPH_FULL_RETRIEVE === 'true',
    };

    // @ts-ignore
    const mergedConfig: EphemeresConfig = {};

    Object.keys(envs).map((key) => {
      let mergedValue = envs[key];
      if (val) {
        mergedValue = envs[key] ?? val[key];
      }

      if (!mergedValue) {
        throw new InternalServerErrorException(`Missing config prop: ${key}`);
      }

      mergedConfig[key] = mergedValue;
    });

    return mergedConfig;
  }
}
