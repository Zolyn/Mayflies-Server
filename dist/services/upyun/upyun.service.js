"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpyunService = void 0;
const common_1 = require("@nestjs/common");
const upyun = require("upyun");
const path_1 = require("path");
const utils_1 = require("../../core/utils");
let UpyunService = class UpyunService {
    mergeStorageConfig(config) {
        const envs = {
            service: process.env.UPYUN_SERVICE,
            operator: process.env.UPYUN_OPERATOR,
            password: process.env.UPYUN_PASSWORD,
        };
        const mergedConfig = {};
        Object.keys(envs).map((key) => {
            var _a;
            let mergedValue = envs[key];
            if (config) {
                mergedValue = (_a = envs[key]) !== null && _a !== void 0 ? _a : config[key];
            }
            if (!mergedValue) {
                throw new common_1.InternalServerErrorException('Missing config props');
            }
            mergedConfig[key] = mergedValue;
        });
        return mergedConfig;
    }
    async retriveUpyunFileList(config, fullRetrive) {
        const { service, operator, password } = config;
        const instance = new upyun.Service(service, operator, password);
        const client = new upyun.Client(instance);
        const dirMap = {};
        async function getDirectoryMap(path) {
            const fileMetaList = [];
            const [err, currentFiles] = await (0, utils_1.awaitHelper)(client.listDir(path));
            if (!currentFiles) {
                if (typeof currentFiles === 'boolean') {
                    throw new common_1.InternalServerErrorException('No such file or directory');
                }
                throw new common_1.InternalServerErrorException(err);
            }
            for (const { type: fileIdentifier, name, time, size, } of currentFiles.files) {
                const { type, icon } = (0, utils_1.getFileTypeAndIcon)(name);
                const fileMeta = {
                    isDir: false,
                    pathname: name,
                    transformedTime: (0, utils_1.transformTime)(time),
                    transformedSize: (0, utils_1.transformBytes)(size),
                    type,
                    icon,
                    time,
                    size,
                };
                if (fileIdentifier === 'F' && fullRetrive) {
                    const fullPath = (0, path_1.join)(path, name);
                    await getDirectoryMap(fullPath);
                    fileMeta.isDir = true;
                    fileMeta.icon = 'folder';
                    fileMeta.type = 'folder';
                }
                fileMetaList.push(fileMeta);
            }
            dirMap[path] = {
                pathname: path,
                files: fileMetaList,
            };
        }
        await getDirectoryMap('/');
        return dirMap;
    }
};
UpyunService = __decorate([
    (0, common_1.Injectable)()
], UpyunService);
exports.UpyunService = UpyunService;
//# sourceMappingURL=upyun.service.js.map