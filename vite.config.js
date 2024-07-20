import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

import Vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"

function resolvePackage(name) {
    const path = `../../packages/${name}/src/index.js`
    return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
    plugins: [
        Vue(),
        Components({
            dirs: [
                "src/components",
                "src/projects/file-explorer",
                "src/layouts",
                "src/pages",
            ],
        }),
        AutoImport({
            imports: [
                "vue",
            ],
            dirs: [
                "src/composables/**",
            ],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(
                new URL("./src", import.meta.url),
            ),
        },
    },
    base: "/foxscribe/",
})
