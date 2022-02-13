import { EphemeresConfig, FileType } from '../types';
declare type StringKeyObject = Record<string, any>;
declare function defineConfig(config: EphemeresConfig): EphemeresConfig;
declare function awaitHelper<T>(promise: Promise<T>): Promise<[string, T | null]>;
declare function transformTime(time: number): string;
declare function transformBytes(bytes: number): string;
declare function getFileTypeAndIcon(name: string): FileType;
declare function deepMerge<T extends StringKeyObject>(target: T, merge: T): T;
declare function mergeConfigAndEnv<T extends object>(identity: string, config: T, envs: T): T;
export { awaitHelper, defineConfig, transformTime, transformBytes, getFileTypeAndIcon, deepMerge, mergeConfigAndEnv, };
