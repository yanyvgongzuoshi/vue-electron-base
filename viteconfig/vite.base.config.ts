// vite 的通用配置

import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// 导入 electron开发时的插件，实现一键启动两个服务的功能
import { ElectronDevPlugin } from '../plugins/vite.dev.plugin'
// 导入 打包时的插件，实现一键打包两个服务的功能
import { ElectronBuildPlugin } from '../plugins/vite.build.plugin'

import { defineConfig } from "vite"
/** 导入 用于ELementPlus的自动按需引入 */
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
/** 导入 用于ELementPlus的自动按需引入 */
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
console.log('load base-config...')
export default defineConfig({

    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        // 添加自定义的插件
        ElectronDevPlugin(),
        ElectronBuildPlugin(),
        AutoImport({
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ['vue'],

            // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
            resolvers: [
                ElementPlusResolver(),
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
        }),

        Components({
            resolvers: [
                // Auto register icon components
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                // Auto register Element Plus components
                // 自动导入 Element Plus 组件
                ElementPlusResolver(),
            ],
        }),

        Icons({
            autoInstall: true,
        }),
    ],

    // 指定参数配置的文件目录(比较关键)
    envDir: 'environmentconfig',

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../src', import.meta.url))
        }
    },

})
