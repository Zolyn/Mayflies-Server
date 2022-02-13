import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { awaitHelper } from './core/utils';
import {
  EphemeresConfig,
  PlainDirectoryMap,
  ProviderList,
  ProviderMap,
  ResolvedEphemeresConfig,
  ResolvedProviderConfig,
  StorageService,
} from './core/types';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async readConfig(): Promise<ResolvedEphemeresConfig> {
    const [
      _,
      {
        default: { storageProviders, fullRetrieve = true },
      },
    ] = await awaitHelper<{ default: EphemeresConfig }>(
      // @ts-ignore
      import('./core/config'),
    );

    if (!storageProviders) {
      throw new InternalServerErrorException('No storage provider was found');
    }

    const providersMap: ProviderMap = new Map();

    if (Array.isArray(storageProviders)) {
      storageProviders.map((provider) => {
        providersMap.set(provider.name, provider.config);
      });
    } else {
      providersMap.set(storageProviders.name, storageProviders.config);
    }

    return { providersMap, fullRetrieve };
  }

  async getProviderConfig(path: ProviderList): Promise<ResolvedProviderConfig> {
    const { providersMap, fullRetrieve } = await this.readConfig();
    if (providersMap.has(path)) {
      return { providerConfig: providersMap.get(path), fullRetrieve };
    } else {
      throw new InternalServerErrorException(
        'The specific provider is not configured.',
      );
    }
  }

  async tryGetCache(
    key: string,
    service: StorageService,
    resolvedProviderConfig: ResolvedProviderConfig,
  ): Promise<PlainDirectoryMap> {
    const cache: PlainDirectoryMap = await this.cacheManager.get(key);

    if (cache) {
      console.log(`Sending cache for ${key}`);
      return cache;
    }

    return await this.cacheManager.set(
      key,
      await service.main(resolvedProviderConfig),
      { ttl: 60 },
    );
  }
}
