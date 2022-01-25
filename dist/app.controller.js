"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const upyun_service_1 = require("./services/upyun/upyun.service");
let AppController = class AppController {
    constructor(cacheManager, appService, upyunService) {
        this.cacheManager = cacheManager;
        this.appService = appService;
        this.upyunService = upyunService;
    }
    async getFileList(realIP) {
        const cache = await this.cacheManager.get(realIP);
        if (cache) {
            console.log(`Sending cache for ${realIP}`);
            return cache;
        }
        const config = await this.appService.readConfig();
        let result;
        switch (config.storage) {
            case 'upyun': {
                const mergedStorageConfig = this.upyunService.mergeStorageConfig(config.storageConfig);
                result = await this.upyunService.retriveUpyunFileList(mergedStorageConfig, config.fullRetrive);
            }
        }
        return await this.cacheManager.set(realIP, result);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-real-ip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFileList", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, app_service_1.AppService,
        upyun_service_1.UpyunService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map