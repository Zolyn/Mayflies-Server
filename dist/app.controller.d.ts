import { AppService } from './app.service';
import { UpyunService } from './services/upyun/upyun.service';
import { DirectoryMap } from './core/types';
export declare class AppController {
    private readonly appService;
    private readonly upyunService;
    constructor(appService: AppService, upyunService: UpyunService);
    getFileList(): Promise<DirectoryMap>;
}
