import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
// 引入环境配置文件
import ViteBaseConfig from "./viteconfig/vite.base.config"
import ViteDevConfig from "./viteconfig/vite.dev.config"

export default mergeConfig(
  Object.assign({},ViteBaseConfig,ViteDevConfig),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
