import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

const getCache = ({ name, pattern }: any) => ({
  urlPattern: pattern,
  handler: 'CacheFirst' as const,
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365 * 2 // 2 years
    },
    cacheableResponse: {
      statuses: [200]
    }
  }
})
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      // injectRegister: 'auto',
      registerType: 'autoUpdate', // 如果此项值为autoUpdate，则为自动给更新
      manifest: {
        name: 'Scanner',
        short_name: 'Scanner',
        description: '扫码器',
        theme_color: '#000000',
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
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,jpeg}'], // 缓存相关静态资源，这个放开会导致页面html被缓存，谨慎使用
        // clientsClaim: true,
        // skipWaiting: true,
        runtimeCaching: [
          // 配置自定义运行时缓存
          getCache({
            pattern: /^https:\/\/192.168.1.107:443/,
            name: 'local-upload',
          }),
          getCache({
            pattern: /^https:\/\/192.168.1.107:443/,
            name: 'webapp',
          }),
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    vue(),
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
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    // 允许用户为css的压缩设置一个不同的浏览器target, 与build esbuild一致
    cssTarget: '',
    emptyOutDir: false,
    reportCompressedSize: false,
    // 启用压缩大小报告,
    // brotliSize: false,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    rollupOptions: {
      output: {
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
