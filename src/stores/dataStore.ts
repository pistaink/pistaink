import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ISearchEngine, IShortcut, IAppData } from '@/types/models'
import { storageService } from '@/services/storageService'
import { generateId } from '@/utils/helpers'

export const useDataStore = defineStore('data', () => {
	// 状态
	const engines = ref<ISearchEngine[]>([])
	const shortcuts = ref<IShortcut[]>([])
	const defaultEngine = ref<string>('')
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	
	// 计算属性
	const getEngineById = computed(() => (id: string) => {
		return engines.value.find(engine => engine.id === id)
	})
	
	const getShortcutById = computed(() => (id: string) => {
		return shortcuts.value.find(shortcut => shortcut.id === id)
	})
	
	// 加载数据
	async function loadData() {
		isLoading.value = true
		error.value = null
		
		try {
			// 先尝试从本地存储加载
			let data = await storageService.getData()
			
			// 如果本地没有数据，从默认配置文件加载
			if (!data) {
				data = await storageService.loadDefaultData()
			}
			
			// 如果成功获取数据，更新状态
			if (data) {
				engines.value = data.engines || []
				shortcuts.value = data.shortcuts || []
				defaultEngine.value = data.defaultEngine || ''
			} else {
				// 如果都失败了，使用空数据
				engines.value = []
				shortcuts.value = []
				defaultEngine.value = ''
				error.value = '无法加载数据'
			}
		} catch (e) {
			const err = e as Error
			console.error('加载数据失败:', err)
			error.value = err.message
		} finally {
			isLoading.value = false
		}
	}
	
	// 保存数据
	async function saveData() {
		try {
			const data: IAppData = {
				engines: engines.value,
				shortcuts: shortcuts.value,
				defaultEngine: defaultEngine.value,
				defaultLanguage: 'zh', // 默认语言
				languages: {} // 语言包在i18nStore中处理
			}
			
			await storageService.saveData(data)
		} catch (e) {
			const err = e as Error
			console.error('保存数据失败:', err)
			throw err
		}
	}
	
	// 添加搜索引擎
	async function addEngine(engine: Omit<ISearchEngine, 'id'>) {
		try {
			const newEngine: ISearchEngine = {
				id: generateId(),
				...engine
			}
			
			engines.value.push(newEngine)
			
			// 如果是第一个引擎，设为默认
			if (engines.value.length === 1) {
				defaultEngine.value = newEngine.id
			}
			
			await saveData()
			return newEngine
		} catch (e) {
			const err = e as Error
			console.error('添加搜索引擎失败:', err)
			throw err
		}
	}
	
	// 更新搜索引擎
	async function updateEngine(id: string, updates: Partial<ISearchEngine>) {
		try {
			const index = engines.value.findIndex(e => e.id === id)
			if (index === -1) throw new Error('未找到搜索引擎')
			
			engines.value[index] = { ...engines.value[index], ...updates }
			await saveData()
		} catch (e) {
			const err = e as Error
			console.error('更新搜索引擎失败:', err)
			throw err
		}
	}
	
	// 删除搜索引擎
	async function deleteEngine(id: string) {
		try {
			engines.value = engines.value.filter(e => e.id !== id)
			
			// 如果删除的是默认引擎，更新默认引擎
			if (defaultEngine.value === id && engines.value.length > 0) {
				defaultEngine.value = engines.value[0].id
			}
			
			await saveData()
		} catch (e) {
			const err = e as Error
			console.error('删除搜索引擎失败:', err)
			throw err
		}
	}
	
	// 设置默认搜索引擎
	async function setDefaultEngine(id: string) {
		try {
			if (!engines.value.some(e => e.id === id)) {
				throw new Error('无效的搜索引擎ID')
			}
			
			defaultEngine.value = id
			await saveData()
		} catch (e) {
			const err = e as Error
			console.error('设置默认搜索引擎失败:', err)
			throw err
		}
	}
	
	// 添加快捷方式
	async function addShortcut(shortcut: Omit<IShortcut, 'id'>) {
		try {
			const newShortcut: IShortcut = {
				id: generateId(),
				...shortcut
			}
			
			shortcuts.value.push(newShortcut)
			await saveData()
			return newShortcut
		} catch (e) {
			const err = e as Error
			console.error('添加快捷方式失败:', err)
			throw err
		}
	}
	
	// 更新快捷方式
	async function updateShortcut(id: string, updates: Partial<IShortcut>) {
		try {
			const index = shortcuts.value.findIndex(s => s.id === id)
			if (index === -1) throw new Error('未找到快捷方式')
			
			shortcuts.value[index] = { ...shortcuts.value[index], ...updates }
			await saveData()
		} catch (e) {
			const err = e as Error
			console.error('更新快捷方式失败:', err)
			throw err
		}
	}
	
	// 删除快捷方式
	async function deleteShortcut(id: string) {
		try {
			shortcuts.value = shortcuts.value.filter(s => s.id !== id)
			await saveData()
		} catch (e) {
			const err = e as Error
			console.error('删除快捷方式失败:', err)
			throw err
		}
	}
	
	return {
		// 状态
		engines,
		shortcuts,
		defaultEngine,
		isLoading,
		error,
		
		// 计算属性
		getEngineById,
		getShortcutById,
		
		// 方法
		loadData,
		saveData,
		addEngine,
		updateEngine,
		deleteEngine,
		setDefaultEngine,
		addShortcut,
		updateShortcut,
		deleteShortcut
	}
}) 