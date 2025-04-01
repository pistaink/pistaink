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
		// 尝试不同的路径加载默认数据
		const pathsToTry = [
			'/static/default.json', 
			'./static/default.json',
			'static/default.json',
			'../static/default.json',
			window.location.origin + '/static/default.json'
		];
		
		// 添加时间戳来避免缓存问题
		const timestamp = new Date().getTime();
		
		for (const basePath of pathsToTry) {
			const path = `${basePath}?_=${timestamp}`;
			console.log(`尝试从路径加载默认数据: ${path}`);
			
			try {
				const response = await fetch(path);
				if (!response.ok) {
					console.warn(`路径 ${path} 加载失败: HTTP错误 ${response.status}`);
					continue;
				}
				
				console.log(`成功从 ${path} 获取响应`);
				const text = await response.text();
				
				if (!text || text.trim() === '') {
					console.warn(`路径 ${path} 返回的数据为空`);
					continue;
				}
				
				try {
					const defaultData = JSON.parse(text);
					console.log('成功解析default.json数据:', {
						engines: defaultData.engines?.length || 0,
						shortcuts: defaultData.shortcuts?.length || 0,
						defaultEngine: defaultData.defaultEngine
					});
					
					// 保存默认数据到本地存储
					this.saveData(defaultData);
					console.log('默认数据已保存到本地存储');
					return defaultData;
				} catch (parseError) {
					console.error(`解析JSON失败 (${path}):`, parseError);
					continue;
				}
			} catch (error) {
				console.warn(`尝试路径 ${path} 时出错:`, error);
			}
		}
		
		// 如果所有路径都失败，返回手动创建的默认数据
		console.error('所有路径都无法加载默认数据，创建基本的默认数据');
		
		// 创建一个简单的默认数据集
		const hardcodedDefault: IAppData = {
			engines: [
				{
					id: "google",
					name: { zh: "谷歌", en: "Google" },
					url: "https://www.google.com/search?q=",
					iconUrl: "https://www.google.com/favicon.ico"
				},
				{
					id: "bing",
					name: { zh: "必应", en: "Microsoft Bing" },
					url: "https://www.bing.com/search?q=",
					iconUrl: "https://www.bing.com/favicon.ico"
				},
				{
					id: "baidu",
					name: { zh: "百度", en: "Baidu" },
					url: "https://www.baidu.com/s?wd=",
					iconUrl: "https://www.baidu.com/favicon.ico"
				}
			],
			shortcuts: [
				{
					id: "github",
					name: { zh: "GitHub", en: "GitHub" },
					url: "https://github.com",
					iconUrl: "https://github.com/favicon.ico"
				},
				{
					id: "youtube",
					name: { zh: "YouTube", en: "YouTube" },
					url: "https://youtube.com",
					iconUrl: "https://www.youtube.com/favicon.ico"
				}
			],
			defaultEngine: "bing",
			defaultLanguage: "zh",
			languages: {}
		};
		
		// 保存这个默认数据
		this.saveData(hardcodedDefault);
		return hardcodedDefault;
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