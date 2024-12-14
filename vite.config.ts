import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      // injectRegister: 'auto',
      // registerType: 'autoUpdate', // 如果此项值为autoUpdate，则为自动给更新
      manifest: {
        name: 'Scanner', // 项目名
        id: 'Scanner',
        short_name: 'Scanner',
        description: '扫码器',
        theme_color: '#4DBA87',
        background_color: '#000000', // 首次在移动设备上启动应用时，启动画面会使用 background_color 属性。
        display: 'fullscreen', // 您可以自定义应用启动时显示的浏览器界面。例如，您可以隐藏地址栏和浏览器界面元素
        icons: [
          //添加图标，注意路径和图像像素正确，sizes必须和图片的尺寸一致
          {
            src: 'logo-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'logo-48.png',
            sizes: '48x48',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'logo-72.png',
            sizes: '72x72',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-96.png',
            sizes: '96x96',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-114.png',
            sizes: '114x114',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,jpeg}'],		// 缓存相关静态资源，这个放开会导致页面html被缓存，谨慎使用
        // clientsClaim: true,
        // skipWaiting: true,
      },
      devOptions: {
        enabled: true,
      },
    }),
    basicSsl(),
    svgLoader(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [pathResolve('src/assets/svg/')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/style/index.scss";`,
  //     },
  //   },
  // },
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 9999,
    https: true,
  },
  build: {
    // 最终构建的浏览器兼容目标
    target: 'es2015',
    // 是否自动注入module preload的polyfill
    polyfillModulePreload: true,
    // 指定混淆器
    minify: 'esbuild',
    // 启用css代码拆分
    cssCodeSplit: true,
    // 允许用户为css的压缩设置一个不同的浏览器target, 与build esbuild一致
    cssTarget: '',
    // 清空输入文件夹
    emptyOutDir: false,
    // 取消计算文件大小，加快打包速度
    reportCompressedSize: false,
    // 启用压缩大小报告,
    // brotliSize: false,
    // chunk大小警告的限制
    chunkSizeWarningLimit: 500,
    // 取消sourceMap， 加快打包速度,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules'))
            return id
              .toString()
              .split('node_modules')[1]
              .split('/')[0]
              .toString()
        },
        entryFileNames: 'js/[name].hash.js',
        chunkFileNames: 'js/[name].hash.js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name
          if (fileName?.endsWith('.svg'))
            return 'img/svg/[name]-[hash][extname]'
          return 'css/[name]-[hash][extname]'
        },
      },
    },
  },
})
