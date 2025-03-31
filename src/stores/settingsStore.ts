import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storageService } from '@/services/storageService'
import type { IBackgroundSettings, ThemeMode, ISettings } from '@/types/models'

// 默认设置
const DEFAULT_SETTINGS: ISettings = {
	themeMode: 'auto',
	backgroundSettings: {
		type: 'bing',
		opacity: 0.3
	},
	language: 'zh'
}

export const useSettingsStore = defineStore('settings', () => {
	// 状态
	const themeMode = ref<ThemeMode>(DEFAULT_SETTINGS.themeMode)
	const backgroundSettings = ref<IBackgroundSettings>(DEFAULT_SETTINGS.backgroundSettings)
	const language = ref<string>(DEFAULT_SETTINGS.language)
	
	// 加载设置
	async function loadSettings() {
		try {
			const settings = storageService.getSettings()
			
			if (settings) {
				themeMode.value = settings.themeMode || DEFAULT_SETTINGS.themeMode
				backgroundSettings.value = settings.backgroundSettings || DEFAULT_SETTINGS.backgroundSettings
				language.value = settings.language || DEFAULT_SETTINGS.language
			}
			
			// 应用主题模式
			applyThemeMode()
		} catch (error) {
			console.error('Failed to load settings:', error)
		}
	}
	
	// 保存设置
	async function saveSettings() {
		try {
			const settings: ISettings = {
				themeMode: themeMode.value,
				backgroundSettings: backgroundSettings.value,
				language: language.value
			}
			
			storageService.saveSettings(settings)
		} catch (error) {
			console.error('Failed to save settings:', error)
		}
	}
	
	// 设置主题模式
	function setThemeMode(mode: ThemeMode) {
		themeMode.value = mode
		applyThemeMode()
		saveSettings()
	}
	
	// 应用主题模式
	function applyThemeMode() {
		const htmlEl = document.documentElement
		
		if (themeMode.value === 'auto') {
			// 跟随系统
			const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
			htmlEl.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light')
		} else {
			// 手动设置
			htmlEl.setAttribute('data-theme', themeMode.value)
		}
	}
	
	// 设置背景设置
	function setBackgroundSettings(settings: IBackgroundSettings) {
		backgroundSettings.value = settings
		saveSettings()
	}
	
	// 设置语言
	function setLanguage(lang: string) {
		language.value = lang
		saveSettings()
	}
	
	// 重置所有设置
	function resetSettings() {
		themeMode.value = DEFAULT_SETTINGS.themeMode
		backgroundSettings.value = DEFAULT_SETTINGS.backgroundSettings
		language.value = DEFAULT_SETTINGS.language
		
		applyThemeMode()
		saveSettings()
	}
	
	return {
		themeMode,
		backgroundSettings,
		language,
		loadSettings,
		saveSettings,
		setThemeMode,
		setBackgroundSettings,
		setLanguage,
		resetSettings
	}
}) 