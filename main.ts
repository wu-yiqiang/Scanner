import { createApp } from 'vue'
import router from '@/router/index'
import '@/style/index.scss'
import 'amfe-flexible'
import 'virtual:svg-icons-register'
import App from './App.vue'
// import VConsole from 'vconsole'
// new VConsole()
import vhCheck from 'vh-check'
vhCheck()
import { useRegisterSW } from 'virtual:pwa-register/vue'
useRegisterSW()

createApp(App).use(router).mount('#app')
