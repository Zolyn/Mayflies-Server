import { DirectoryMap, UpyunSdk } from '~/core/types';
export declare class UpyunService {
    mergeStorageConfig(config: UpyunSdk | undefined): UpyunSdk;
    retriveUpyunFileList(config: UpyunSdk, fullRetrieve: boolean): Promise<DirectoryMap>;
}
