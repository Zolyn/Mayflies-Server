declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // Upyun
      UPYUN_SERVICE: string;
      UPYUN_OPERATOR: string;
      UPYUN_PASSWORD: string;
    }
  }
}

interface UpyunConfig {
  service?: string;
  operator?: string;
  password?: string;
}

interface TenConfig {
  operator?: string;
}

type ProviderList = 'upyun' | 'ten';

type ProviderConfigs = UpyunConfig | TenConfig;

interface ResolvedProviderConfig {
  providerConfig: ProviderConfigs;
  fullRetrieve: boolean;
}

type ProviderMap = Map<ProviderList, ProviderConfigs>;

interface StorageProvider {
  name: ProviderList;
  config?: ProviderConfigs;
}

interface EphemeresConfig {
  fullRetrieve?: boolean;
  storageProviders: StorageProvider | StorageProvider[];
}

interface ResolvedEphemeresConfig {
  fullRetrieve: boolean;
  providersMap: ProviderMap;
}

interface StorageService {
  main({
    providerConfig,
    fullRetrieve,
  }: ResolvedProviderConfig): Promise<PlainDirectoryMap>;
}

// TODO: Move some logic to client side
interface PlainFileMeta {
  isDir: boolean;
  pathname: string;
  time: number;
  size: number;
}

interface PlainDirectoryMeta {
  pathname: string;
  files: PlainFileMetaList;
}

interface FileType {
  suffix: string[];
  type: string;
  icon: string;
}

type PlainFileMetaList = PlainFileMeta[];

interface PlainDirectoryMap {
  [path: string]: PlainDirectoryMeta;
}

export {
  StorageService,
  StorageProvider,
  EphemeresConfig,
  ResolvedEphemeresConfig,
  ProviderMap,
  ProviderList,
  ProviderConfigs,
  ResolvedProviderConfig,
  UpyunConfig,
  TenConfig,
  PlainDirectoryMap,
  PlainFileMeta,
  PlainFileMetaList,
  FileType,
};
