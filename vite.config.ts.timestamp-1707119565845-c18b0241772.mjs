// vite.config.ts
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { loadEnv } from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5_less@4.2.0/node_modules/vite/dist/node/index.js";

// plugins/index.ts
import vue from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/@vitejs+plugin-vue@4.5.2_vite@5.0.10_vue@3.3.12/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.10_vue@3.3.12/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@10.7.0/node_modules/unplugin-auto-import/dist/vite.js";
import GenerateConfig from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/unplugin-config@0.1.4_esbuild@0.19.9_vite@5.0.10/node_modules/unplugin-config/dist/vite.js";
import Components from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/unplugin-vue-components@0.25.2_vue@3.3.12/node_modules/unplugin-vue-components/dist/vite.mjs";
import VitePluginPreloadAll from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/@mistjs+vite-plugin-preload@0.0.1_vite@5.0.10/node_modules/@mistjs/vite-plugin-preload/dist/index.mjs";
import Unocss from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/unocss@0.57.7_postcss@8.4.32_vite@5.0.10/node_modules/unocss/dist/vite.mjs";
import AntdvResolver from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/antdv-component-resolver@1.0.5_unplugin-vue-components@0.25.2/node_modules/antdv-component-resolver/dist/index.mjs";

// plugins/constants.ts
var GLOB_CONFIG_FILE_NAME = "_app.config.js";
var OUTPUT_DIR = "dist";

// plugins/vite-build-info.ts
import { readdir, stat } from "node:fs";
import dayjs from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import duration from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/plugin/duration.js";
import pkg from "file:///D:/java_work/demo3/zg_framework/admin/node_modules/.pnpm/picocolors@1.0.0/node_modules/picocolors/picocolors.js";
var { green, blue, bold } = pkg;
dayjs.extend(duration);
var fileListTotal = [];
function recursiveDirectory(folder, callback) {
  readdir(folder, (err, files) => {
    if (err)
      throw err;
    let count = 0;
    const checkEnd = () => {
      ++count === files.length && callback();
    };
    files.forEach((item) => {
      stat(`${folder}/${item}`, async (err2, stats) => {
        if (err2)
          throw err2;
        if (stats.isFile()) {
          fileListTotal.push(stats.size);
          checkEnd();
        } else if (stats.isDirectory()) {
          recursiveDirectory(`${folder}/${item}/`, checkEnd);
        }
      });
    });
    files.length === 0 && callback();
  });
}
function sum(arr) {
  return arr.reduce((t, c) => {
    return t + c;
  }, 0);
}
function formatBytes(a, b) {
  if (a === 0)
    return "0 Bytes";
  const c = 1024;
  const d = b || 2;
  const e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const f = Math.floor(Math.log(a) / Math.log(c));
  return `${Number.parseFloat((a / c ** f).toFixed(d))} ${e[f]}`;
}
function viteBuildInfo(name) {
  let config;
  let startTime;
  let endTime;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      console.log(
        bold(
          green(
            `\u{1F44F}\u6B22\u8FCE\u4F7F\u7528${blue(`[${name}]`)}\uFF0C\u73B0\u5728\u6B63\u5168\u529B\u4E3A\u60A8${config.command === "build" ? "\u6253\u5305" : "\u7F16\u8BD1"}`
          )
        )
      );
      if (config.command === "build")
        startTime = dayjs(/* @__PURE__ */ new Date());
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(/* @__PURE__ */ new Date());
        recursiveDirectory(config.build.outDir, () => {
          console.log(
            bold(
              green(
                `\u606D\u559C\u6253\u5305\u5B8C\u6210\u{1F389}\uFF08\u603B\u7528\u65F6${dayjs.duration(endTime.diff(startTime)).format("mm\u5206ss\u79D2")}\uFF0C\u6253\u5305\u540E\u7684\u5927\u5C0F\u4E3A${formatBytes(
                  sum(fileListTotal)
                )}\uFF09`
              )
            )
          );
        });
      }
    }
  };
}

// plugins/index.ts
function createVitePlugins(env) {
  const vitePluginList = [
    vue(),
    vueJsx(),
    VitePluginPreloadAll(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/core",
        "pinia"
      ],
      dts: "types/auto-imports.d.ts",
      dirs: ["src/stores", "src/composables"]
    }),
    Components({
      resolvers: [AntdvResolver()],
      dts: "types/components.d.ts",
      dirs: ["src/components"]
    }),
    // https://github.com/kirklin/unplugin-config
    GenerateConfig({
      appName: env.VITE_GLOB_APP_TITLE,
      configFile: {
        generate: true,
        fileName: GLOB_CONFIG_FILE_NAME,
        outputDir: OUTPUT_DIR
      },
      envVariables: {
        prefix: "VITE_GLOB_"
      }
    }),
    Unocss(),
    viteBuildInfo(env.VITE_APP_NAME)
  ];
  return vitePluginList;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/java_work/demo3/zg_framework/admin/vite.config.ts";
var baseSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const proxyObj = {};
  return {
    plugins: createVitePlugins(env),
    resolve: {
      alias: [
        {
          find: "dayjs",
          replacement: "dayjs/esm"
        },
        {
          find: /^dayjs\/locale/,
          replacement: "dayjs/esm/locale"
        },
        {
          find: /^dayjs\/plugin/,
          replacement: "dayjs/esm/plugin"
        },
        {
          find: "vue-i18n",
          replacement: mode === "development" ? "vue-i18n/dist/vue-i18n.esm-browser.js" : "vue-i18n/dist/vue-i18n.esm-bundler.js"
        },
        {
          find: /^ant-design-vue\/es$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue\/dist$/,
          replacement: "ant-design-vue/dist"
        },
        {
          find: /^ant-design-vue\/lib$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: "lodash",
          replacement: "lodash-es"
        },
        {
          find: "~@",
          replacement: baseSrc
        },
        {
          find: "~",
          replacement: baseSrc
        },
        {
          find: "@",
          replacement: baseSrc
        },
        {
          find: "~#",
          replacement: resolve(baseSrc, "./enums")
        }
      ]
    },
    build: {
      chunkSizeWarningLimit: 4096,
      outDir: OUTPUT_DIR,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
            antd: ["ant-design-vue", "@ant-design/icons-vue", "dayjs"]
            // lodash: ['loadsh-es'],
          }
        }
      }
    },
    server: {
      port: 6678,
      host: "0.0.0.0",
      proxy: {
        ...proxyObj
        // [env.VITE_APP_BASE_API]: {
        //   target: env.VITE_APP_BASE_URL,
        // //   如果你是https接口，需要配置这个参数
        // //   secure: false,
        //   changeOrigin: true,
        //   rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        // },
      }
    },
    test: {
      globals: true,
      environment: "jsdom"
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy9pbmRleC50cyIsICJwbHVnaW5zL2NvbnN0YW50cy50cyIsICJwbHVnaW5zL3ZpdGUtYnVpbGQtaW5mby50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGphdmFfd29ya1xcXFxkZW1vM1xcXFx6Z19mcmFtZXdvcmtcXFxcYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGphdmFfd29ya1xcXFxkZW1vM1xcXFx6Z19mcmFtZXdvcmtcXFxcYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2phdmFfd29yay9kZW1vMy96Z19mcmFtZXdvcmsvYWRtaW4vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB0eXBlIHsgQ29uZmlnRW52LCBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGNyZWF0ZVZpdGVQbHVnaW5zIH0gZnJvbSAnLi9wbHVnaW5zJ1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4vcGx1Z2lucy9jb25zdGFudHMnXG5cbmNvbnN0IGJhc2VTcmMgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG4gIGNvbnN0IHByb3h5T2JqID0ge31cbiAgLy8gaWYgKG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiYgZW52LlZJVEVfQVBQX0JBU0VfQVBJX0RFViAmJiBlbnYuVklURV9BUFBfQkFTRV9VUkxfREVWKSB7XG4gIC8vICAgcHJveHlPYmpbZW52LlZJVEVfQVBQX0JBU0VfQVBJX0RFVl0gPSB7XG4gIC8vICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQUF9CQVNFX1VSTF9ERVYsXG4gIC8vICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gIC8vICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUElfREVWfWApLCAnJyksXG4gIC8vICAgfVxuICAvLyB9XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogY3JlYXRlVml0ZVBsdWdpbnMoZW52KSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmluZDogJ2RheWpzJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2RheWpzL2VzbScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAvXmRheWpzXFwvbG9jYWxlLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2RheWpzL2VzbS9sb2NhbGUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogL15kYXlqc1xcL3BsdWdpbi8sXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdkYXlqcy9lc20vcGx1Z2luJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICd2dWUtaTE4bicsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnJvd3Nlci5qcycgOiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnVuZGxlci5qcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlXFwvZXMkLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2FudC1kZXNpZ24tdnVlL2VzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9kaXN0JC8sXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9kaXN0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9saWIkLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2FudC1kZXNpZ24tdnVlL2VzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWUkLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2FudC1kZXNpZ24tdnVlL2VzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICdsb2Rhc2gnLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnbG9kYXNoLWVzJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICd+QCcsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAnficsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAnQCcsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAnfiMnLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKGJhc2VTcmMsICcuL2VudW1zJyksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNDA5NixcbiAgICAgIG91dERpcjogT1VUUFVUX0RJUixcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICB2dWU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnLCAndnVlLWkxOG4nLCAnQHZ1ZXVzZS9jb3JlJ10sXG4gICAgICAgICAgICBhbnRkOiBbJ2FudC1kZXNpZ24tdnVlJywgJ0BhbnQtZGVzaWduL2ljb25zLXZ1ZScsICdkYXlqcyddLFxuICAgICAgICAgICAgLy8gbG9kYXNoOiBbJ2xvYWRzaC1lcyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA2Njc4LFxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLi4ucHJveHlPYmosXG4gICAgICAgIC8vIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOiB7XG4gICAgICAgIC8vICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXG4gICAgICAgIC8vIC8vICAgXHU1OTgyXHU2NzlDXHU0RjYwXHU2NjJGaHR0cHNcdTYzQTVcdTUzRTNcdUZGMENcdTk3MDBcdTg5ODFcdTkxNERcdTdGNkVcdThGRDlcdTRFMkFcdTUzQzJcdTY1NzBcbiAgICAgICAgLy8gLy8gICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAvLyAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgLy8gICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUEl9YCksICcnKSxcbiAgICAgICAgLy8gfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICBnbG9iYWxzOiB0cnVlLFxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgfSxcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxqYXZhX3dvcmtcXFxcZGVtbzNcXFxcemdfZnJhbWV3b3JrXFxcXGFkbWluXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGphdmFfd29ya1xcXFxkZW1vM1xcXFx6Z19mcmFtZXdvcmtcXFxcYWRtaW5cXFxccGx1Z2luc1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovamF2YV93b3JrL2RlbW8zL3pnX2ZyYW1ld29yay9hZG1pbi9wbHVnaW5zL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IEdlbmVyYXRlQ29uZmlnIGZyb20gJ3VucGx1Z2luLWNvbmZpZy92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBWaXRlUGx1Z2luUHJlbG9hZEFsbCBmcm9tICdAbWlzdGpzL3ZpdGUtcGx1Z2luLXByZWxvYWQnXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEFudGR2UmVzb2x2ZXIgZnJvbSAnYW50ZHYtY29tcG9uZW50LXJlc29sdmVyJ1xuaW1wb3J0IHsgR0xPQl9DT05GSUdfRklMRV9OQU1FLCBPVVRQVVRfRElSIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgeyB2aXRlQnVpbGRJbmZvIH0gZnJvbSAnLi92aXRlLWJ1aWxkLWluZm8nXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucyhlbnY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgY29uc3Qgdml0ZVBsdWdpbkxpc3Q6IChQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSlbXSA9IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICBWaXRlUGx1Z2luUHJlbG9hZEFsbCgpLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAndnVlLWkxOG4nLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAgJ3BpbmlhJyxcbiAgICAgIF0sXG4gICAgICBkdHM6ICd0eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICBkaXJzOiBbJ3NyYy9zdG9yZXMnLCAnc3JjL2NvbXBvc2FibGVzJ10sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtBbnRkdlJlc29sdmVyKCldLFxuICAgICAgZHRzOiAndHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcbiAgICB9KSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20va2lya2xpbi91bnBsdWdpbi1jb25maWdcbiAgICBHZW5lcmF0ZUNvbmZpZyh7XG4gICAgICBhcHBOYW1lOiBlbnYuVklURV9HTE9CX0FQUF9USVRMRSxcbiAgICAgIGNvbmZpZ0ZpbGU6IHtcbiAgICAgICAgZ2VuZXJhdGU6IHRydWUsXG4gICAgICAgIGZpbGVOYW1lOiBHTE9CX0NPTkZJR19GSUxFX05BTUUsXG4gICAgICAgIG91dHB1dERpcjogT1VUUFVUX0RJUixcbiAgICAgIH0sXG4gICAgICBlbnZWYXJpYWJsZXM6IHtcbiAgICAgICAgcHJlZml4OiAnVklURV9HTE9CXycsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFVub2NzcygpLFxuICAgIHZpdGVCdWlsZEluZm8oZW52LlZJVEVfQVBQX05BTUUpLFxuICBdXG4gIHJldHVybiB2aXRlUGx1Z2luTGlzdFxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxqYXZhX3dvcmtcXFxcZGVtbzNcXFxcemdfZnJhbWV3b3JrXFxcXGFkbWluXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGphdmFfd29ya1xcXFxkZW1vM1xcXFx6Z19mcmFtZXdvcmtcXFxcYWRtaW5cXFxccGx1Z2luc1xcXFxjb25zdGFudHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2phdmFfd29yay9kZW1vMy96Z19mcmFtZXdvcmsvYWRtaW4vcGx1Z2lucy9jb25zdGFudHMudHNcIjsvLyBUaGlzIGNvbnN0YW50IGRlZmluZXMgdGhlIG5hbWUgb2YgdGhlIGNvbmZpZ3VyYXRpb24gZmlsZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiB0aGUgcHJvZHVjdGlvbiBlbnZpcm9ubWVudFxuZXhwb3J0IGNvbnN0IEdMT0JfQ09ORklHX0ZJTEVfTkFNRSA9ICdfYXBwLmNvbmZpZy5qcydcblxuLy8gVGhpcyBjb25zdGFudCBzZXRzIHRoZSBvdXRwdXQgZGlyZWN0b3J5IGZvciB0aGUgVml0ZSBwYWNrYWdlXG5leHBvcnQgY29uc3QgT1VUUFVUX0RJUiA9ICdkaXN0J1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxqYXZhX3dvcmtcXFxcZGVtbzNcXFxcemdfZnJhbWV3b3JrXFxcXGFkbWluXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGphdmFfd29ya1xcXFxkZW1vM1xcXFx6Z19mcmFtZXdvcmtcXFxcYWRtaW5cXFxccGx1Z2luc1xcXFx2aXRlLWJ1aWxkLWluZm8udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2phdmFfd29yay9kZW1vMy96Z19mcmFtZXdvcmsvYWRtaW4vcGx1Z2lucy92aXRlLWJ1aWxkLWluZm8udHNcIjtpbXBvcnQgeyByZWFkZGlyLCBzdGF0IH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBSZXNvbHZlZENvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgdHlwZSB7IERheWpzIH0gZnJvbSAnZGF5anMnXG5pbXBvcnQgZHVyYXRpb24gZnJvbSAnZGF5anMvcGx1Z2luL2R1cmF0aW9uJ1xuaW1wb3J0IHBrZyBmcm9tICdwaWNvY29sb3JzJ1xuXG5jb25zdCB7IGdyZWVuLCBibHVlLCBib2xkIH0gPSBwa2dcbmRheWpzLmV4dGVuZChkdXJhdGlvbilcblxuY29uc3QgZmlsZUxpc3RUb3RhbDogbnVtYmVyW10gPSBbXVxuXG5mdW5jdGlvbiByZWN1cnNpdmVEaXJlY3RvcnkoZm9sZGVyOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICByZWFkZGlyKGZvbGRlciwgKGVyciwgZmlsZXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgaWYgKGVycilcbiAgICAgIHRocm93IGVyclxuICAgIGxldCBjb3VudCA9IDBcbiAgICBjb25zdCBjaGVja0VuZCA9ICgpID0+IHtcbiAgICAgICsrY291bnQgPT09IGZpbGVzLmxlbmd0aCAmJiBjYWxsYmFjaygpXG4gICAgfVxuICAgIGZpbGVzLmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xuICAgICAgc3RhdChgJHtmb2xkZXJ9LyR7aXRlbX1gLCBhc3luYyAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgIHRocm93IGVyclxuICAgICAgICBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgICAgICBmaWxlTGlzdFRvdGFsLnB1c2goc3RhdHMuc2l6ZSlcbiAgICAgICAgICBjaGVja0VuZCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIHJlY3Vyc2l2ZURpcmVjdG9yeShgJHtmb2xkZXJ9LyR7aXRlbX0vYCwgY2hlY2tFbmQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICBmaWxlcy5sZW5ndGggPT09IDAgJiYgY2FsbGJhY2soKVxuICB9KVxufVxuXG5mdW5jdGlvbiBzdW0oYXJyOiBudW1iZXJbXSkge1xuICByZXR1cm4gYXJyLnJlZHVjZSgodDogbnVtYmVyLCBjOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gdCArIGNcbiAgfSwgMClcbn1cbmZ1bmN0aW9uIGZvcm1hdEJ5dGVzKGE6IG51bWJlciwgYj86IG51bWJlcik6IHN0cmluZyB7XG4gIGlmIChhID09PSAwKVxuICAgIHJldHVybiAnMCBCeXRlcydcbiAgY29uc3QgYyA9IDEwMjRcbiAgY29uc3QgZCA9IGIgfHwgMlxuICBjb25zdCBlID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddXG4gIGNvbnN0IGYgPSBNYXRoLmZsb29yKE1hdGgubG9nKGEpIC8gTWF0aC5sb2coYykpXG4gIHJldHVybiBgJHtOdW1iZXIucGFyc2VGbG9hdCgoYSAvIGMgKiogZikudG9GaXhlZChkKSl9ICR7ZVtmXX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXRlQnVpbGRJbmZvKG5hbWU6IHN0cmluZyk6IFBsdWdpbiB7XG4gIGxldCBjb25maWc6IFJlc29sdmVkQ29uZmlnXG4gIGxldCBzdGFydFRpbWU6IERheWpzXG4gIGxldCBlbmRUaW1lOiBEYXlqc1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlOmJ1aWxkSW5mbycsXG4gICAgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IHJlc29sdmVkQ29uZmlnXG4gICAgfSxcbiAgICBidWlsZFN0YXJ0KCkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGJvbGQoXG4gICAgICAgICAgZ3JlZW4oXG4gICAgICAgICAgICBgXHVEODNEXHVEQzRGXHU2QjIyXHU4RkNFXHU0RjdGXHU3NTI4JHtibHVlKGBbJHtuYW1lfV1gKX1cdUZGMENcdTczQjBcdTU3MjhcdTZCNjNcdTUxNjhcdTUyOUJcdTRFM0FcdTYwQTgke2NvbmZpZy5jb21tYW5kID09PSAnYnVpbGQnID8gJ1x1NjI1M1x1NTMwNScgOiAnXHU3RjE2XHU4QkQxJ1xuICAgICAgICAgICAgfWAsXG4gICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICAgIGlmIChjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJylcbiAgICAgICAgc3RhcnRUaW1lID0gZGF5anMobmV3IERhdGUoKSlcbiAgICB9LFxuICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgaWYgKGNvbmZpZy5jb21tYW5kID09PSAnYnVpbGQnKSB7XG4gICAgICAgIGVuZFRpbWUgPSBkYXlqcyhuZXcgRGF0ZSgpKVxuICAgICAgICByZWN1cnNpdmVEaXJlY3RvcnkoY29uZmlnLmJ1aWxkLm91dERpciwgKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgYm9sZChcbiAgICAgICAgICAgICAgZ3JlZW4oXG4gICAgICAgICAgICAgICAgYFx1NjA2RFx1NTU5Q1x1NjI1M1x1NTMwNVx1NUI4Q1x1NjIxMFx1RDgzQ1x1REY4OVx1RkYwOFx1NjAzQlx1NzUyOFx1NjVGNiR7ZGF5anNcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihlbmRUaW1lLmRpZmYoc3RhcnRUaW1lKSlcbiAgICAgICAgICAgICAgICAgIC5mb3JtYXQoJ21tXHU1MjA2c3NcdTc5RDInKX1cdUZGMENcdTYyNTNcdTUzMDVcdTU0MEVcdTc2ODRcdTU5MjdcdTVDMEZcdTRFM0Eke2Zvcm1hdEJ5dGVzKFxuICAgICAgICAgICAgICAgICAgICBzdW0oZmlsZUxpc3RUb3RhbCksXG4gICAgICAgICAgICAgICAgICApfVx1RkYwOWAsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxlQUFlO0FBQ3hCLFNBQVMscUJBQXFCO0FBQzlCLFlBQVksYUFBYTtBQUN6QixTQUFTLGVBQWU7OztBQ0h4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sMEJBQTBCO0FBQ2pDLE9BQU8sWUFBWTtBQUNuQixPQUFPLG1CQUFtQjs7O0FDUG5CLElBQU0sd0JBQXdCO0FBRzlCLElBQU0sYUFBYTs7O0FDSm1ULFNBQVMsU0FBUyxZQUFZO0FBRTNXLE9BQU8sV0FBVztBQUVsQixPQUFPLGNBQWM7QUFDckIsT0FBTyxTQUFTO0FBRWhCLElBQU0sRUFBRSxPQUFPLE1BQU0sS0FBSyxJQUFJO0FBQzlCLE1BQU0sT0FBTyxRQUFRO0FBRXJCLElBQU0sZ0JBQTBCLENBQUM7QUFFakMsU0FBUyxtQkFBbUIsUUFBZ0IsVUFBMEI7QUFDcEUsVUFBUSxRQUFRLENBQUMsS0FBSyxVQUFvQjtBQUN4QyxRQUFJO0FBQ0YsWUFBTTtBQUNSLFFBQUksUUFBUTtBQUNaLFVBQU0sV0FBVyxNQUFNO0FBQ3JCLFFBQUUsVUFBVSxNQUFNLFVBQVUsU0FBUztBQUFBLElBQ3ZDO0FBQ0EsVUFBTSxRQUFRLENBQUMsU0FBaUI7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
