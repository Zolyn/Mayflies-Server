import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { UpyunService } from './services/upyun/upyun.service';
import { DirectoryMap } from './core/types';
export declare class AppController {
    private cacheManager;
    private readonly appService;
    private readonly upyunService;
    constructor(cacheManager: Cache, appService: AppService, upyunService: UpyunService);
    getFileList(realIP: string): Promise<DirectoryMap>;
}
