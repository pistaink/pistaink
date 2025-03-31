import { createRouter, createWebHashHistory } from 'vue-router'

// 注意：使用Hash模式避免刷新页面时在GitHub Pages上出现404问题
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../App.vue')
		}
	]
})

export default router 