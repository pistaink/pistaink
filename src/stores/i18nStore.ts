import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService } from '@/services/storageService'
import type { ILanguagePack, IAppData } from '@/types/models'

export const useI18nStore = defineStore('i18n', () => {
	// 状态
	const currentLanguage = ref('zh')
	const languages = ref<Record<string, ILanguagePack>>({})
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	
	// 计算属性
	const t = computed(() => {
		return (key: string): string => {
			if (!languages.value[currentLanguage.value]) {
				return key
			}
			
			return languages.value[currentLanguage.value][key] || key
		}
	})
	
	const availableLanguages = computed(() => {
		return Object.keys(languages.value)
	})
	
	// 初始化语言数据
	async function initI18n() {
		isLoading.value = true
		error.value = null
		
		try {
			// 加载数据
			let data = await storageService.getData()
			
			if (!data) {
				data = await storageService.loadDefaultData()
			}
			
			if (data) {
				// 更新语言包
				languages.value = data.languages || {}
				
				// 设置当前语言
				if (data.defaultLanguage) {
					currentLanguage.value = data.defaultLanguage
				}
			} else {
				error.value = '无法加载语言数据'
			}
		} catch (e) {
			const err = e as Error
			console.error('初始化国际化失败:', err)
			error.value = err.message
		} finally {
			isLoading.value = false
		}
	}
	
	// 切换语言
	function setLanguage(lang: string) {
		if (!languages.value[lang]) {
			console.warn(`语言 ${lang} 不存在`)
			return
		}
		
		currentLanguage.value = lang
		
		// 保存到本地存储
		updateDefaultLanguage(lang)
	}
	
	// 更新默认语言
	async function updateDefaultLanguage(lang: string) {
		try {
			// 获取当前数据
			const data = await storageService.getData()
			
			if (data) {
				// 更新默认语言
				data.defaultLanguage = lang
				
				// 保存更新后的数据
				await storageService.saveData(data)
			}
		} catch (e) {
			const err = e as Error
			console.error('更新默认语言失败:', err)
			throw err
		}
	}
	
	// 添加新语言
	async function addLanguage(lang: string, translations: ILanguagePack) {
		try {
			// 如果已存在，合并翻译
			if (languages.value[lang]) {
				languages.value[lang] = { ...languages.value[lang], ...translations }
			} else {
				// 否则创建新语言
				languages.value[lang] = translations
			}
			
			// 保存到本地存储
			await saveLanguages()
		} catch (e) {
			const err = e as Error
			console.error('添加语言失败:', err)
			throw err
		}
	}
	
	// 移除语言
	async function removeLanguage(lang: string) {
		try {
			if (Object.keys(languages.value).length <= 1) {
				throw new Error('不能删除唯一的语言')
			}
			
			if (currentLanguage.value === lang) {
				throw new Error('不能删除当前使用的语言')
			}
			
			// 删除语言
			const newLanguages = { ...languages.value }
			delete newLanguages[lang]
			languages.value = newLanguages
			
			// 保存到本地存储
			await saveLanguages()
		} catch (e) {
			const err = e as Error
			console.error('删除语言失败:', err)
			throw err
		}
	}
	
	// 更新翻译
	async function updateTranslation(lang: string, key: string, value: string) {
		try {
			if (!languages.value[lang]) {
				throw new Error(`语言 ${lang} 不存在`)
			}
			
			// 更新翻译
			languages.value[lang][key] = value
			
			// 保存到本地存储
			await saveLanguages()
		} catch (e) {
			const err = e as Error
			console.error('更新翻译失败:', err)
			throw err
		}
	}
	
	// 保存语言包到本地存储
	async function saveLanguages() {
		try {
			// 获取当前数据
			const data = await storageService.getData()
			
			if (data) {
				// 更新语言包
				data.languages = languages.value
				
				// 保存更新后的数据
				await storageService.saveData(data)
			}
		} catch (e) {
			const err = e as Error
			console.error('保存语言包失败:', err)
			throw err
		}
	}
	
	return {
		// 状态
		currentLanguage,
		languages,
		isLoading,
		error,
		
		// 计算属性
		t,
		availableLanguages,
		
		// 方法
		initI18n,
		setLanguage,
		addLanguage,
		removeLanguage,
		updateTranslation,
		saveLanguages
	}
}) 