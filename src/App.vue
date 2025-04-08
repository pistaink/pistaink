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

		<!-- 设置面板 -->
		<SettingsPanel v-model="isSettingsOpen" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18nStore } from '@/stores/i18nStore'
import { useBackgroundService } from '@/services/backgroundService'
import { pluginManager } from '@/plugins/core/plugin-system'
import Header from '@/components/layout/Header.vue'
import SearchBox from '@/components/search/SearchBox.vue'
import ShortcutGrid from '@/components/shortcuts/ShortcutGrid.vue'
import PluginRegistry from '@/plugins/core/PluginRegistry.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'

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

// 设置面板状态
const isSettingsOpen = ref(false)

// 打开设置面板
function openSettings() {
	isSettingsOpen.value = true
}

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

	// 添加监听设置面板打开事件
	window.addEventListener('openSettings', openSettings)

	// 1. 添加主题切换的响应式监听
	watch(
		() => settingsStore.themeMode,
		(newMode) => {
			document.documentElement.setAttribute('data-theme', newMode);
			if (newMode === 'auto') {
				updateThemeBasedOnPreference(window.matchMedia('(prefers-color-scheme: dark)'));
			}
		},
		{ immediate: true }
	);
})

// 清理监听器
onBeforeUnmount(() => {
	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
	darkModeMediaQuery.removeEventListener('change', updateThemeBasedOnPreference)

	// 移除设置面板事件监听
	window.removeEventListener('openSettings', openSettings)
})

// 根据系统偏好设置主题
function updateThemeBasedOnPreference(e: MediaQueryListEvent | MediaQueryList) {
	const isDarkMode = e.matches;
	if (settingsStore.themeMode === 'auto') {
		document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
	}
}
</script>

<style>
/* 1. 修改全局主题变量 */
:root {
	/* Light theme variables */
	--bg-color: #ffffff;
	--text-color: #333333;
	--border-color: #e5e5e5;
	--hover-color: #f5f5f5;
	--primary-color: #4a90e2;
	--modal-backdrop: rgba(0, 0, 0, 0.5);
	--secondary-text-color: #666666; /* 添加次要文本颜色 */
	--input-text-color: #333333;    /* 输入框文本颜色 */
	--button-text-color: #333333;   /* 按钮文本颜色 */
	--icon-color: #555555;          /* 图标颜色 */
	--dropdown-bg: #ffffff;         /* 下拉菜单背景 */
	--modal-bg: #ffffff;            /* 模态框背景 */
	--card-bg: #ffffff;             /* 卡片背景 */
}

[data-theme="dark"] {
	/* Dark theme variables */
	--bg-color: #1a1a1a;
	--text-color: #ffffff;        /* 修改为纯白色 */
	--border-color: #444444;      /* 深色边框更明显 */
	--hover-color: #2a2a2a;
	--primary-color: #64b5f6;
	--modal-backdrop: rgba(0, 0, 0, 0.7);
	--secondary-text-color: #cccccc; /* 暗色模式下的次要文本颜色更亮 */
	--input-text-color: #ffffff;    /* 输入框文本颜色 */
	--button-text-color: #ffffff;   /* 按钮文本颜色 */
	--icon-color: #bbbbbb;          /* 图标颜色 */
	--dropdown-bg: #2c2c2c;         /* 下拉菜单背景 */
	--modal-bg: #2c2c2c;            /* 模态框背景 */
	--card-bg: #2c2c2c;             /* 卡片背景 */
}

/* 全局样式 */
.app-container {
	background-color: var(--bg-color);
	color: var(--text-color);
	min-height: 100vh;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	color: var(--text-color);
}

/* 输入框和按钮的样式覆盖 */
input, textarea, select {
	color: var(--input-text-color);
	background-color: var(--bg-color);
	border: 1px solid var(--border-color);
}

button {
	color: var(--button-text-color);
}

/* 模态框和下拉菜单通用样式 */
.modal-content {
	background-color: var(--modal-bg);
	color: var(--text-color);
}

.dropdown-menu {
	background-color: var(--dropdown-bg);
	color: var(--text-color);
}

.dropdown-item {
	color: var(--text-color);
}

.dropdown-item:hover {
	background-color: var(--hover-color);
}

/* 确保所有标题文本使用正确的颜色 */
h1, h2, h3, h4, h5, h6 {
	color: var(--text-color);
}
</style>