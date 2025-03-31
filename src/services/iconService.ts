import { ref } from 'vue'

// 存储键名
const ICON_CACHE_KEY = 'pistaink_icons'

// 默认图标（灰色占位图标）
const DEFAULT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg=='

class IconService {
	private iconCache: Record<string, string> = {}
	private isLoading = ref(false)
	private error = ref<string | null>(null)
	
	constructor() {
		this.loadIconCache()
	}
	
	/**
	 * 从缓存中加载图标数据
	 */
	private loadIconCache(): void {
		try {
			const cacheStr = localStorage.getItem(ICON_CACHE_KEY)
			if (cacheStr) {
				this.iconCache = JSON.parse(cacheStr)
			}
		} catch (error) {
			console.error('Error loading icon cache:', error)
			this.iconCache = {}
		}
	}
	
	/**
	 * 保存图标缓存到本地存储
	 */
	private saveIconCache(): void {
		try {
			localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(this.iconCache))
		} catch (error) {
			console.error('Error saving icon cache:', error)
		}
	}
	
	/**
	 * 解析域名
	 */
	private getDomain(url: string): string {
		try {
			const urlObj = new URL(url)
			return urlObj.hostname
		} catch (error) {
			// 如果URL无效，尝试处理格式
			if (url.startsWith('http://') || url.startsWith('https://')) {
				const parts = url.split('/')
				if (parts.length >= 3) return parts[2]
			} else {
				const parts = url.split('/')
				if (parts.length >= 1) return parts[0]
			}
			return url
		}
	}
	
	/**
	 * 尝试从Google获取Favicon
	 */
	private async fetchFromGoogle(domain: string): Promise<string> {
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
	}
	
	/**
	 * 获取网站图标
	 * @param url 网站URL
	 * @param forceRefresh 是否强制刷新缓存
	 */
	async fetchIcon(url: string, forceRefresh = false): Promise<string> {
		const domain = this.getDomain(url)
		
		this.isLoading.value = true
		this.error.value = null
		
		try {
			// 检查缓存
			if (!forceRefresh && this.iconCache[domain]) {
				return this.iconCache[domain]
			}
			
			// 使用Google的favicon服务
			const iconUrl = await this.fetchFromGoogle(domain)
			
			// 缓存图标URL
			this.iconCache[domain] = iconUrl
			this.saveIconCache()
			
			return iconUrl
		} catch (error) {
			console.error('Error fetching icon:', error)
			this.error.value = `无法获取图标: ${error}`
			return DEFAULT_ICON
		} finally {
			this.isLoading.value = false
		}
	}
	
	/**
	 * 从缓存获取图标
	 */
	getIcon(url: string): string {
		const domain = this.getDomain(url)
		return this.iconCache[domain] || DEFAULT_ICON
	}
	
	/**
	 * 清除指定域名的图标缓存
	 */
	clearIconCache(url: string): void {
		const domain = this.getDomain(url)
		if (this.iconCache[domain]) {
			delete this.iconCache[domain]
			this.saveIconCache()
		}
	}
	
	/**
	 * 清除所有图标缓存
	 */
	clearAllIconCache(): void {
		this.iconCache = {}
		this.saveIconCache()
	}
	
	// 提供加载状态和错误状态
	get loading() {
		return this.isLoading
	}
	
	get errorMessage() {
		return this.error
	}
}

// 导出单例
export const iconService = new IconService() 