import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/global.scss'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())

// 挂载应用
app.mount('#app') 