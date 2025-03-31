/**
 * 生成唯一ID
 * 使用nanoid的思路但简化实现，生成短的唯一ID
 */
export function generateId(length = 8): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	const charactersLength = chars.length
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

/**
 * 从URL中获取域名
 */
export function getDomain(url: string): string {
	try {
		const urlObj = new URL(url)
		return urlObj.hostname
	} catch (e) {
		// 如果URL格式不正确，尝试一下兼容处理
		if (!url.startsWith('http')) {
			return getDomain(`https://${url}`)
		}
		console.error('获取域名失败:', e)
		return ''
	}
}

/**
 * 格式化URL（确保有http/https前缀）
 */
export function formatUrl(url: string): string {
	if (!url) return ''
	
	// 已经有协议前缀的直接返回
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url
	}
	
	// 默认添加https前缀
	return `https://${url}`
}

/**
 * 深度合并两个对象
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
	const result: any = { ...target }
	
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (
				source[key] !== null &&
				typeof source[key] === 'object' &&
				!Array.isArray(source[key])
			) {
				// 递归合并对象
				result[key] = deepMerge(result[key] || {}, source[key] as any)
			} else {
				// 直接替换值或数组
				result[key] = source[key]
			}
		}
	}
	
	return result
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait = 300
): (...args: Parameters<T>) => void {
	let timeout: number | null = null
	
	return function (...args: Parameters<T>): void {
		const later = () => {
			timeout = null
			func(...args)
		}
		
		if (timeout !== null) {
			clearTimeout(timeout)
		}
		timeout = window.setTimeout(later, wait)
	}
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit = 300
): (...args: Parameters<T>) => void {
	let inThrottle = false
	
	return function (...args: Parameters<T>): void {
		if (!inThrottle) {
			func(...args)
			inThrottle = true
			setTimeout(() => {
				inThrottle = false
			}, limit)
		}
	}
}

/**
 * 本地化日期
 */
export function formatDate(date: Date | number | string, locale = 'zh-CN'): string {
	const d = new Date(date)
	return d.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
} 