declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      // Upyun
      UPYUN_SERVICE?: string;
      UPYUN_OPERATOR?: string;
      UPYUN_PASSWORD?: string;
    }
  }
}

interface UpyunSdk {
  service: string;
  operator: string;
  password: string;
}

interface TenSdk {
  operator: string;
}

type SDKs = UpyunSdk | TenSdk;

type StorageTypes = 'upyun' | 'ten';

interface EphemeresConfig {
  storage: StorageTypes;
  host: string;
  fullRetrive: boolean;
  storageConfig?: SDKs;
}

interface FileMeta {
  isDir: boolean;
  pathname: string;
  type: string;
  icon: string;
  time: number;
  size: number;
  transformedTime: string;
  transformedSize: string;
}

interface DirectoryMeta {
  pathname: string;
  files: FileMeta[];
}

interface FileType {
  suffix: string[];
  type: string;
  icon: string;
}

type FileMetaList = FileMeta[];

interface DirectoryMap {
  [path: string]: DirectoryMeta;
}

export {
  EphemeresConfig,
  UpyunSdk,
  TenSdk,
  DirectoryMap,
  FileMeta,
  FileMetaList,
  FileType,
};
