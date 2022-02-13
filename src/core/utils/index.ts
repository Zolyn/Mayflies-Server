/**
 * await帮助函数，帮助捕获异常
 * 由于只需要关心结果是否存在，err始终为string
 */
import { EphemeresConfig, UpyunSdk, TenSdk, FileType } from '../types';
import { extname } from 'path';

// 只有string类型的键的对象
interface StringKeyObject {
  [p: string]: any;
}

interface UpyunConfig extends EphemeresConfig {
  storage: 'upyun';
  storageConfig?: UpyunSdk;
}

// Not implemented yet
interface TenConfig extends EphemeresConfig {
  storage: 'ten';
  storageConfig?: TenSdk;
}

function defineConfig(config: UpyunConfig): UpyunConfig;

function defineConfig(config: TenConfig): TenConfig;

function defineConfig(config: EphemeresConfig): EphemeresConfig {
  return config;
}

function awaitHelper<T>(promise: Promise<T>): Promise<[string, T | null]> {
  return promise
    .then<[string, T]>((res) => ['', res])
    .catch<[string, null]>((err) => [err, null]);
}

function formatTime(time: number): string {
  if (time < 10) {
    return '0' + time;
  } else {
    return time.toString();
  }
}

// TODO: Move some logic to client side
function transformTime(time: number): string {
  const rawDate = new Date(time * 1000);
  const year = rawDate.getFullYear();
  const month = rawDate.getMonth() + 1;
  const date = rawDate.getDate();
  const hour = rawDate.getHours();
  const minute = rawDate.getMinutes();
  const second = rawDate.getSeconds();

  return `${year}-${month}-${date} ${hour}:${formatTime(minute)}:${formatTime(
    second,
  )}`;
}

function transformBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let result = '-';

  units.reduce((prev, val) => {
    if (!prev) {
      return prev;
    }

    const transformedBytes = parseFloat((bytes / prev).toFixed(2));

    if (transformedBytes < 1024 || val === 'GB') {
      result = `${transformedBytes} ${val}`;
      return 0;
    }

    return prev * 1024;
  }, 1);

  return result;
}

const fileTypeMap: FileType[] = [
  {
    suffix: ['txt', 'log', 'out'],
    type: 'text',
    icon: 'node-text',
  },
  {
    suffix: ['png', 'jpg', 'webm', 'gif'],
    type: 'image',
    icon: 'file-image',
  },
  {
    suffix: ['doc', 'docx'],
    type: 'word',
    icon: 'file-word',
  },
  {
    suffix: ['xls', 'xlsx', 'et'],
    type: 'excel',
    icon: 'file-excel',
  },
  {
    suffix: ['ppt', 'pptx'],
    type: 'powerpoint',
    icon: 'file-powerpoint',
  },
  {
    suffix: ['zip', 'rar', '7z', 'tar', 'gz', 'zst', 'lzma', 'iso', 'jar'],
    type: 'zip',
    icon: 'zip-box',
  },
  {
    suffix: ['mp4', 'mkv', 'wmv', 'flv'],
    type: 'video',
    icon: 'file-video',
  },
  {
    suffix: ['mp3', 'ogg', 'wav', 'aac'],
    type: 'music',
    icon: 'file-music',
  },
  {
    suffix: ['pdf'],
    type: 'pdf',
    icon: 'file-pdf',
  },
  {
    suffix: ['md'],
    type: 'markdown',
    icon: 'language-markdown',
  },
  {
    suffix: ['js'],
    type: 'javascript',
    icon: 'language-javascript',
  },
  {
    suffix: ['ts'],
    type: 'typescript',
    icon: 'language-typescript',
  },
  {
    suffix: ['vue'],
    type: 'vue',
    icon: 'vuejs',
  },
  {
    suffix: ['css'],
    type: 'css',
    icon: 'language-css-3',
  },
  {
    suffix: ['json'],
    type: 'json',
    icon: 'code-json',
  },
];

const transformedFileTypeMap: Map<string, FileType> = new Map(
  fileTypeMap
    .map((val) => val.suffix.map<[string, FileType]>((suffix) => [suffix, val]))
    .flat(),
);

function getFileTypeAndIcon(name: string): FileType {
  const fileTypeObject = transformedFileTypeMap.get(extname(name).slice(1));
  const normalFile: FileType = {
    suffix: [],
    type: 'file',
    icon: 'file-cloud',
  };

  return fileTypeObject ?? normalFile;
}

// 深度合并两个对象
function deepMerge<T extends StringKeyObject>(target: T, merge: T): T {
  const keys = [...new Set([...Object.keys(target), ...Object.keys(merge)])];
  const mergedObject: StringKeyObject = {};
  keys.map((key): undefined => {
    if (typeof target[key] === 'object' && typeof merge[key] === 'object') {
      mergedObject[key] = deepMerge(target[key], merge[key]);
    } else {
      mergedObject[key] = merge[key] ?? target[key];
    }

    return undefined;
  });

  return mergedObject as T;
}

export {
  awaitHelper,
  defineConfig,
  UpyunConfig,
  TenConfig,
  transformTime,
  transformBytes,
  getFileTypeAndIcon,
  deepMerge,
};
