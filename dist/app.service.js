"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("./core/utils");
let AppService = class AppService {
    async readConfig() {
        const [_, val] = await (0, utils_1.awaitHelper)(Promise.resolve().then(() => require('./core/config')));
        const envs = {
            storage: process.env.EPH_STORAGE,
            host: process.env.EPH_HOST,
            fullRetrieve: process.env.EPH_FULL_RETRIEVE === 'true',
        };
        const mergedConfig = {};
        Object.keys(envs).map((key) => {
            var _a;
            let mergedValue = envs[key];
            if (val) {
                mergedValue = (_a = envs[key]) !== null && _a !== void 0 ? _a : val[key];
            }
            if (!mergedValue) {
                throw new common_1.InternalServerErrorException(`Missing config props: ${key}`);
            }
            mergedConfig[key] = mergedValue;
        });
        return mergedConfig;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map