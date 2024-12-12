import { createApp } from 'vue'
import '@/style.css'
import 'amfe-flexible'
import 'virtual:svg-icons-register'
import App from './App.vue'
import vhCheck from 'vh-check'
vhCheck()
createApp(App).mount('#app')
