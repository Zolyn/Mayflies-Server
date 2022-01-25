import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { awaitHelper } from './core/utils';
import { EphemeresConfig } from './core/types';

@Injectable()
export class AppService {
  async readConfig(): Promise<EphemeresConfig> {
    // @ts-ignore
    const [err, val] = await awaitHelper(import('./core/config'));

    if (!val) {
      throw new InternalServerErrorException(err);
    }

    return val.default;
  }
}
