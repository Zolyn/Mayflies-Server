import { EphemeresConfig, UpyunSdk, TenSdk, FileType } from '../types';
interface StringKeyObject {
    [p: string]: any;
}
interface UpyunConfig extends EphemeresConfig {
    storage: 'upyun';
    storageConfig?: UpyunSdk;
}
interface TenConfig extends EphemeresConfig {
    storage: 'ten';
    storageConfig?: TenSdk;
}
declare function defineConfig(config: UpyunConfig): UpyunConfig;
declare function defineConfig(config: TenConfig): TenConfig;
declare function awaitHelper<T>(promise: Promise<T>): Promise<[string, T | null]>;
declare function transformTime(time: number): string;
declare function transformBytes(bytes: number): string;
declare function getFileTypeAndIcon(name: string): FileType;
declare function deepMerge<T extends StringKeyObject>(target: T, merge: T): T;
export { awaitHelper, defineConfig, UpyunConfig, TenConfig, transformTime, transformBytes, getFileTypeAndIcon, deepMerge, };
