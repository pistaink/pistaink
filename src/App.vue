<template>
	<div class="app-container">
		<Header>
			<template #plugins>
				<PluginRegistry />
			</template>
		</Header>
		<main class="main-content">
			<SearchBox />
			<ShortcutGrid />
		</main>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18nStore } from '@/stores/i18nStore'
import { useBackgroundService } from '@/services/backgroundService'
import { pluginManager } from '@/plugins/core/plugin-system'
import Header from '@/components/layout/Header.vue'
import SearchBox from '@/components/search/SearchBox.vue'
import ShortcutGrid from '@/components/shortcuts/ShortcutGrid.vue'
import PluginRegistry from '@/plugins/core/PluginRegistry.vue'

// 导入插件
import DrawingPlugin from '@/plugins/drawing'
import ScreenshotPlugin from '@/plugins/screenshot'
import ColorPickerPlugin from '@/plugins/color-picker'
import MemoPlugin from '@/plugins/memo'

// 获取数据
const dataStore = useDataStore()
const settingsStore = useSettingsStore()
const i18nStore = useI18nStore()
const backgroundService = useBackgroundService()

// 初始化数据和设置
onMounted(async () => {
	console.log('App component mounted');
	
	// 清除本地存储中可能已损坏的数据
	console.log('清除本地存储...');
	localStorage.removeItem('pistaink_app_data');
	console.log('本地存储已清除');
	
	// 先加载数据确保搜索引擎和快捷方式可用
	console.log('正在加载应用数据...');
	await dataStore.loadData();
	console.log('应用数据加载完成');
	
	// 注册插件 - 先于其他操作确保插件加载
	console.log('Registering plugins...');
	pluginManager.registerPlugin(DrawingPlugin);
	pluginManager.registerPlugin(ScreenshotPlugin);
	pluginManager.registerPlugin(ColorPickerPlugin);
	pluginManager.registerPlugin(MemoPlugin);
	console.log('Plugins registered:', pluginManager.getAllPlugins().length);
	
	// 初始化i18n
	await i18nStore.initI18n();
	// 加载设置
	await settingsStore.loadSettings();
	// 应用背景
	backgroundService.applyBackground();
	
	// 检查数据是否正确加载，如果没有，重新尝试
	if (dataStore.engines.length === 0 || dataStore.shortcuts.length === 0) {
		console.log('搜索引擎或快捷方式为空，尝试重新加载数据...');
		await dataStore.loadData();
		
		// 如果仍然为空，手动设置一些数据
		if (dataStore.engines.length === 0) {
			console.log('仍然无法加载搜索引擎，使用硬编码数据');
			const engines = [
				{
					id: "google",
					name: { zh: "谷歌", en: "Google" },
					url: "https://www.google.com/search?q="
				},
				{
					id: "bing", 
					name: { zh: "必应", en: "Microsoft Bing" },
					url: "https://www.bing.com/search?q="
				}
			];
			
			// 添加引擎
			for (const engine of engines) {
				await dataStore.addEngine(engine);
			}
			
			// 设置默认引擎
			await dataStore.setDefaultEngine('bing');
		}
		
		// 如果快捷方式为空，添加一些默认快捷方式
		if (dataStore.shortcuts.length === 0) {
			console.log('仍然无法加载快捷方式，使用硬编码数据');
			const shortcuts = [
				{
					name: { zh: "GitHub", en: "GitHub" },
					url: "https://github.com"
				},
				{
					name: { zh: "YouTube", en: "YouTube" },
					url: "https://youtube.com"
				}
			];
			
			// 添加快捷方式
			for (const shortcut of shortcuts) {
				await dataStore.addShortcut(shortcut);
			}
		}
	}
	
	// 监听主题变化
	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
	updateThemeBasedOnPreference(darkModeMediaQuery)
	darkModeMediaQuery.addEventListener('change', updateThemeBasedOnPreference)
})

// 清理监听器
onBeforeUnmount(() => {
	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
	darkModeMediaQuery.removeEventListener('change', updateThemeBasedOnPreference)
})

// 根据系统偏好设置主题
function updateThemeBasedOnPreference(e: MediaQueryListEvent | MediaQueryList) {
	const isDarkMode = e.matches
	// 如果用户没有明确设置主题，则跟随系统
	if (!localStorage.getItem('pistaink_settings')) {
		settingsStore.setThemeMode(isDarkMode ? 'dark' : 'light')
	}
}
</script>

<style lang="scss">
.app-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem;
	box-sizing: border-box;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem 0;
	gap: 2rem;
}
</style> 