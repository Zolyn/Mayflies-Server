import { DirectoryMap, UpyunSdk } from '~/core/types';
export declare class UpyunService {
    mergeStorageConfig(config: UpyunSdk): UpyunSdk;
    retriveUpyunFileList(config: UpyunSdk, fullRetrive: boolean): Promise<DirectoryMap>;
}
