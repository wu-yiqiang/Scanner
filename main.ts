import { createApp } from 'vue'
import router from '@/router/index'
import '@/style/index.scss'
import 'amfe-flexible'
import 'virtual:svg-icons-register'
import App from './App.vue'
import VConsole from 'vconsole'
import vhCheck from 'vh-check'
vhCheck()
new VConsole()
createApp(App).use(router).mount('#app')
