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
		<div v-if="isSettingsOpen" class="settings-modal" style="display: flex;">
			<div class="modal-backdrop" @click="closeSettings"></div>
			<div class="settings-content">
				<div class="settings-header">
					<h2>{{ i18nStore.t('settings') }}</h2>
					<button class="close-button" @click="closeSettings">&times;</button>
				</div>
				<div class="settings-body">
					<div class="settings-sidebar">
						<div 
							class="sidebar-item" 
							:class="{ active: currentSettingsTab === 'general' }"
							@click="currentSettingsTab = 'general'"
						>{{ i18nStore.t('general') }}</div>
						<div 
							class="sidebar-item" 
							:class="{ active: currentSettingsTab === 'search' }"
							@click="currentSettingsTab = 'search'"
						>{{ i18nStore.t('search') }}</div>
						<div 
							class="sidebar-item" 
							:class="{ active: currentSettingsTab === 'import' }"
							@click="currentSettingsTab = 'import'"
						>{{ i18nStore.t('import_export') }}</div>
						<div 
							class="sidebar-item" 
							:class="{ active: currentSettingsTab === 'language' }"
							@click="currentSettingsTab = 'language'"
						>{{ i18nStore.t('language') }}</div>
						<div 
							class="sidebar-item" 
							:class="{ active: currentSettingsTab === 'about' }"
							@click="currentSettingsTab = 'about'"
						>{{ i18nStore.t('about') }}</div>
					</div>
					<div class="settings-panel">
						<!-- 不同设置页面的内容 -->
						<div v-if="currentSettingsTab === 'general'" class="settings-tab-content">
							<h3>{{ i18nStore.t('general_settings') }}</h3>
							<div class="form-group">
								<label>{{ i18nStore.t('theme') }}</label>
								<div class="theme-options">
									<button 
										@click="settingsStore.setThemeMode('light')"
										:class="{ active: settingsStore.themeMode === 'light' }"
									>
										{{ i18nStore.t('light') }}
									</button>
									<button 
										@click="settingsStore.setThemeMode('dark')"
										:class="{ active: settingsStore.themeMode === 'dark' }"
									>
										{{ i18nStore.t('dark') }}
									</button>
									<button 
										@click="settingsStore.setThemeMode('auto')"
										:class="{ active: settingsStore.themeMode === 'auto' }"
									>
										{{ i18nStore.t('auto') }}
									</button>
								</div>
							</div>
						</div>
						<div v-if="currentSettingsTab === 'search'" class="settings-tab-content">
							<h3>{{ i18nStore.t('search_settings') }}</h3>
							<!-- 搜索引擎设置 -->
						</div>
						<div v-if="currentSettingsTab === 'import'" class="settings-tab-content">
							<h3>{{ i18nStore.t('import_export') }}</h3>
							<!-- 导入导出设置 -->
						</div>
						<div v-if="currentSettingsTab === 'language'" class="settings-tab-content">
							<h3>{{ i18nStore.t('language_settings') }}</h3>
							<!-- 语言设置 -->
						</div>
						<div v-if="currentSettingsTab === 'about'" class="settings-tab-content">
							<h3>{{ i18nStore.t('about') }}</h3>
							<p>pistaink.com - v1.0.0</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
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

// 设置面板状态
const isSettingsOpen = ref(false)
const currentSettingsTab = ref('general')

// 打开设置面板
function openSettings() {
	isSettingsOpen.value = true
}

// 关闭设置面板
function closeSettings() {
	isSettingsOpen.value = false
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

// 设置面板样式
.settings-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-backdrop {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.settings-content {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	max-width: 900px;
	max-height: 90vh;
	background-color: var(--card-bg, #ffffff);
	border-radius: 12px;
	box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.15));
	z-index: 2001;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.settings-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-color, #e0e0e0);
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	h2 {
		margin: 0;
		font-size: 18px;
	}
	
	.close-button {
		background: transparent;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: var(--text-color-secondary, #6c757d);
		
		&:hover {
			color: var(--text-color, #212529);
		}
	}
}

.settings-body {
	display: flex;
	height: 500px;
	overflow: hidden;
}

.settings-sidebar {
	width: 200px;
	border-right: 1px solid var(--border-color, #e0e0e0);
	padding: 16px 0;
	
	.sidebar-item {
		padding: 12px 16px;
		cursor: pointer;
		transition: background-color 0.2s;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
		
		&.active {
			background-color: var(--primary-color, #3498db);
			color: white;
		}
	}
}

.settings-panel {
	flex: 1;
	padding: 16px;
	overflow-y: auto;
}

.settings-tab-content {
	h3 {
		margin-top: 0;
		margin-bottom: 16px;
	}
}

.form-group {
	margin-bottom: 16px;
	
	label {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
	}
}

.theme-options {
	display: flex;
	gap: 8px;
	
	button {
		padding: 8px 16px;
		border: 1px solid var(--border-color, #e0e0e0);
		background-color: transparent;
		border-radius: 4px;
		cursor: pointer;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
		
		&.active {
			background-color: var(--primary-color, #3498db);
			color: white;
			border-color: var(--primary-color, #3498db);
		}
	}
}
</style> 