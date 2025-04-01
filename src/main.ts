import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { pluginManager } from './plugins/core/plugin-system'

// 导入全局样式
import './assets/styles/main.scss'

// 立即设置基本CSS变量，确保UI正常显示
document.documentElement.style.setProperty('--primary-color', '#3498db');
document.documentElement.style.setProperty('--border-color', '#e0e0e0');
document.documentElement.style.setProperty('--card-bg', '#ffffff');
document.documentElement.style.setProperty('--dropdown-bg', '#ffffff');
document.documentElement.style.setProperty('--text-color', '#333333');
document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');

console.log('应用初始化开始');

// 创建应用实例
const app = createApp(App)

// 使用Pinia进行状态管理
app.use(createPinia())

// 初始化插件管理器
console.log('插件管理器初始化');
pluginManager.installPlugins(app);

// 挂载应用
app.mount('#app')

// 窗口加载完成后，记录已加载的插件
window.addEventListener('load', () => {
	console.log('Window loaded, plugins available:', pluginManager.getAllPlugins().length);
})

console.log('应用初始化完成'); 