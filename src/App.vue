<template>
	<div class="app-container">
		<Header />
		<main class="main-content">
			<SearchBox />
			<DrawingCanvas />
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
import Header from '@/components/layout/Header.vue'
import SearchBox from '@/components/search/SearchBox.vue'
import ShortcutGrid from '@/components/shortcuts/ShortcutGrid.vue'
import DrawingCanvas from '@/components/drawing/DrawingCanvas.vue'

// 获取数据
const dataStore = useDataStore()
const settingsStore = useSettingsStore()
const i18nStore = useI18nStore()
const backgroundService = useBackgroundService()

// 初始化数据和设置
onMounted(async () => {
	// 加载数据
	await dataStore.loadData()
	// 初始化i18n
	await i18nStore.initI18n()
	// 加载设置
	await settingsStore.loadSettings()
	// 应用背景
	backgroundService.applyBackground()
	
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