import type { IAppData, ISettings } from '@/types/models'

// 存储键名
const APP_DATA_KEY = 'pistaink_app_data'
const SETTINGS_KEY = 'pistaink_settings'

class StorageService {
	/**
	 * 获取应用数据
	 */
	async getData(): Promise<IAppData | null> {
		try {
			const dataStr = localStorage.getItem(APP_DATA_KEY)
			if (dataStr) {
				return JSON.parse(dataStr)
			}
			return null
		} catch (error) {
			console.error('Error loading app data:', error)
			return null
		}
	}
	
	/**
	 * 加载默认数据
	 */
	async loadDefaultData(): Promise<IAppData | null> {
		try {
			// 从静态文件加载默认数据
			const response = await fetch('/static/default.json')
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`)
			}
			const defaultData = await response.json()
			
			// 保存默认数据到本地存储
			this.saveData(defaultData)
			
			return defaultData
		} catch (error) {
			console.error('Error loading default data:', error)
			return null
		}
	}
	
	/**
	 * 保存应用数据
	 */
	async saveData(data: IAppData): Promise<void> {
		try {
			localStorage.setItem(APP_DATA_KEY, JSON.stringify(data))
		} catch (error) {
			console.error('Error saving app data:', error)
			throw error
		}
	}
	
	/**
	 * 获取应用设置
	 */
	getSettings(): ISettings | null {
		try {
			const settingsStr = localStorage.getItem(SETTINGS_KEY)
			if (settingsStr) {
				return JSON.parse(settingsStr)
			}
			return null
		} catch (error) {
			console.error('Error loading settings:', error)
			return null
		}
	}
	
	/**
	 * 保存应用设置
	 */
	saveSettings(settings: ISettings): void {
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
		} catch (error) {
			console.error('Error saving settings:', error)
			throw error
		}
	}
	
	/**
	 * 获取图标缓存
	 */
	getIconCache(): Record<string, string> {
		try {
			const cacheStr = localStorage.getItem('pistaink_icons')
			if (cacheStr) {
				return JSON.parse(cacheStr)
			}
			return {}
		} catch (error) {
			console.error('Error loading icon cache:', error)
			return {}
		}
	}
	
	/**
	 * 保存图标缓存
	 */
	saveIconCache(cache: Record<string, string>): void {
		try {
			localStorage.setItem('pistaink_icons', JSON.stringify(cache))
		} catch (error) {
			console.error('Error saving icon cache:', error)
			throw error
		}
	}
	
	/**
	 * 导出数据
	 */
	exportData(): string {
		try {
			const data = localStorage.getItem(APP_DATA_KEY) || '{}'
			const settings = localStorage.getItem(SETTINGS_KEY) || '{}'
			
			const exportData = {
				appData: JSON.parse(data),
				settings: JSON.parse(settings)
			}
			
			return JSON.stringify(exportData, null, 2)
		} catch (error) {
			console.error('Error exporting data:', error)
			throw error
		}
	}
	
	/**
	 * 导入数据
	 */
	importData(jsonData: string): boolean {
		try {
			const importedData = JSON.parse(jsonData)
			
			if (importedData.appData) {
				localStorage.setItem(APP_DATA_KEY, JSON.stringify(importedData.appData))
			}
			
			if (importedData.settings) {
				localStorage.setItem(SETTINGS_KEY, JSON.stringify(importedData.settings))
			}
			
			return true
		} catch (error) {
			console.error('Error importing data:', error)
			return false
		}
	}
	
	/**
	 * 清除所有数据
	 */
	clearAllData(): void {
		localStorage.removeItem(APP_DATA_KEY)
		localStorage.removeItem(SETTINGS_KEY)
		localStorage.removeItem('pistaink_icons')
	}
}

// 导出单例
export const storageService = new StorageService() 