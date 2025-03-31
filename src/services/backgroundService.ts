import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

// 缓存键名
const BING_IMAGE_CACHE_KEY = 'pistaink_bing_image'
const BING_IMAGE_DATE_KEY = 'pistaink_bing_image_date'

// 默认背景颜色
const DEFAULT_BACKGROUND_COLOR = '#f5f5f5'

export function useBackgroundService() {
	const settingsStore = useSettingsStore()
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	
	/**
	 * 获取必应每日图片
	 */
	async function getBingDailyImage(): Promise<string> {
		isLoading.value = true
		error.value = null
		
		try {
			// 检查缓存
			const cachedImage = localStorage.getItem(BING_IMAGE_CACHE_KEY)
			const cachedDate = localStorage.getItem(BING_IMAGE_DATE_KEY)
			const today = new Date().toDateString()
			
			// 如果有当天的缓存，直接返回
			if (cachedImage && cachedDate === today) {
				return cachedImage
			}
			
			// 获取必应图片
			// 注意：实际应用中，可能需要创建后端API来代理此请求，避免CORS问题
			// 这里使用的URL仅作为示例，而且可能会更改
			const bingUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
			
			// 在真实环境中可能需要使用代理服务
			// 这里为了示例简化，直接返回一个占位图片URL
			// 在实际项目中，你应该替换成真实的API调用
			const placeholderImage = 'https://picsum.photos/1920/1080'
			
			// 缓存图片URL和日期
			localStorage.setItem(BING_IMAGE_CACHE_KEY, placeholderImage)
			localStorage.setItem(BING_IMAGE_DATE_KEY, today)
			
			return placeholderImage
		} catch (e) {
			const err = e as Error
			console.error('Failed to fetch Bing daily image:', err)
			error.value = err.message
			
			// 返回默认图片
			return 'https://picsum.photos/1920/1080'
		} finally {
			isLoading.value = false
		}
	}
	
	/**
	 * 应用背景设置
	 */
	async function applyBackground(): Promise<void> {
		try {
			const { backgroundSettings } = settingsStore
			
			if (!backgroundSettings) {
				// 默认设置
				document.body.style.backgroundColor = '#f5f5f5'
				document.body.style.backgroundImage = 'none'
				return
			}
			
			const { type, color, imageUrl, opacity = 0.5 } = backgroundSettings
			
			// 清除旧样式
			document.body.style.backgroundImage = 'none'
			document.body.style.backgroundColor = 'transparent'
			
			// 根据类型应用背景
			if (type === 'color' && color) {
				document.body.style.backgroundColor = color
			} else if (type === 'image' && imageUrl) {
				document.body.style.backgroundImage = `url(${imageUrl})`
				document.body.style.backgroundSize = 'cover'
				document.body.style.backgroundPosition = 'center'
				document.body.style.backgroundRepeat = 'no-repeat'
			} else if (type === 'bing') {
				const bingImage = await getBingDailyImage()
				document.body.style.backgroundImage = `url(${bingImage})`
				document.body.style.backgroundSize = 'cover'
				document.body.style.backgroundPosition = 'center'
				document.body.style.backgroundRepeat = 'no-repeat'
			}
			
			// 设置背景遮罩透明度
			const overlay = document.querySelector('.background-overlay') as HTMLElement
			if (overlay) {
				overlay.style.opacity = opacity.toString()
			}
		} catch (e) {
			const err = e as Error
			console.error('Failed to apply background:', err)
		}
	}
	
	return {
		isLoading,
		error,
		getBingDailyImage,
		applyBackground
	}
} 