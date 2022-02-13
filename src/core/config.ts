import { defineConfig } from "~/core/utils";
import { upyunProvider } from "~/core/providers";

export default defineConfig({
    storageProviders: upyunProvider(),
});
