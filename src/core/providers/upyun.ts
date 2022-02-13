import { StorageProvider, UpyunConfig } from '~/core/types';

function upyunProvider(config?: UpyunConfig): StorageProvider {
  return { name: 'upyun', config };
}

export { upyunProvider };
