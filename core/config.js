"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const providers_1 = require("./providers");
exports.default = (0, utils_1.defineConfig)({
    storageProviders: (0, providers_1.upyunProvider)(),
});
//# sourceMappingURL=config.js.map