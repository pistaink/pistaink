<template>
	<header class="header">
		<div class="header-container">
			<!-- 插件容器 - 左侧 -->
			<div class="header-plugins">
				<slot name="plugins"></slot>
			</div>
			
			<div class="header-actions">
				<!-- 语言切换 -->
				<div class="language-selector">
					<button @click="toggleLanguageDropdown" class="language-button">
						{{ currentLanguage.toUpperCase() }}
					</button>
					
					<div v-if="isLanguageDropdownOpen" class="dropdown-menu language-dropdown">
						<button 
							v-for="lang in availableLanguages" 
							:key="lang" 
							@click="changeLanguage(lang)"
							:class="{ active: lang === currentLanguage }"
							class="dropdown-item"
						>
							{{ lang.toUpperCase() }}
						</button>
					</div>
				</div>
				
				<!-- 主题切换 -->
				<button @click="toggleTheme" class="theme-button">
					<span v-if="themeMode === 'light'">🌙</span>
					<span v-else-if="themeMode === 'dark'">☀️</span>
					<span v-else>🔄</span>
				</button>
				
				<!-- 设置按钮 -->
				<button class="settings-button" @click="openSettings">
					⚙️ {{ t('settings') }}
				</button>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18nStore } from '@/stores/i18nStore'
import { useSettingsStore } from '@/stores/settingsStore'

// 获取 store
const i18nStore = useI18nStore()
const settingsStore = useSettingsStore()

// 获取翻译函数
const t = i18nStore.t

// 计算属性
const currentLanguage = computed(() => i18nStore.currentLanguage)
const availableLanguages = computed(() => i18nStore.availableLanguages)
const themeMode = computed(() => settingsStore.themeMode)

// 状态
const isLanguageDropdownOpen = ref(false)
const isSettingsOpen = ref(false)

// 切换语言下拉菜单
function toggleLanguageDropdown(event: MouseEvent) {
	event.stopPropagation(); // 阻止事件冒泡
	console.log('切换语言下拉菜单');
	isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
}

// 切换主题
function toggleTheme() {
	const modes: ['light', 'dark', 'auto'] = ['light', 'dark', 'auto']
	const currentIndex = modes.indexOf(themeMode.value)
	const nextIndex = (currentIndex + 1) % modes.length
	settingsStore.setThemeMode(modes[nextIndex])
}

// 切换语言
function changeLanguage(lang: string) {
	console.log('切换语言至:', lang);
	i18nStore.setLanguage(lang)
	isLanguageDropdownOpen.value = false
}

// 打开设置面板
function openSettings() {
	isSettingsOpen.value = true
	// 触发自定义事件，通知父组件打开设置面板
	// 这里实现简单，实际项目可能需要使用Pinia或其他方式管理
	const event = new CustomEvent('openSettings')
	window.dispatchEvent(event)
}

// 关闭下拉菜单的点击外部事件监听
function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (isLanguageDropdownOpen.value && !target.closest('.language-selector')) {
		console.log('关闭语言下拉菜单');
		isLanguageDropdownOpen.value = false;
	}
}

// 添加和移除事件监听器
onMounted(() => {
	console.log('Header组件已挂载');
	document.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
})
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	background-color: transparent;
	position: sticky;
	top: 0;
	z-index: 100;
	padding: 10px 16px;
	
	.header-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.header-plugins {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 150px;
	}
	
	.header-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	
	.language-selector {
		position: relative;
		z-index: 1000; // 增加z-index确保下拉菜单在上层
	}
	
	.language-button,
	.theme-button,
	.settings-button {
		background: transparent;
		color: var(--text-color, #333333);
		border: 1px solid var(--border-color, #e0e0e0);
		border-radius: 4px;
		padding: 6px 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 40px; // 确保有足够的点击区域
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
	
	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 4px;
		min-width: 120px;
		background-color: var(--dropdown-bg, #ffffff);
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		z-index: 1000; // 增加z-index确保在最上层
		border: 1px solid var(--border-color, #e0e0e0);
	}
	
	.dropdown-item {
		display: block;
		width: 100%;
		padding: 8px 12px;
		text-align: left;
		background: transparent;
		border: none;
		color: var(--text-color, #333333);
		cursor: pointer;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
		
		&.active {
			background-color: var(--primary-color, #007bff);
			color: white;
		}
	}
	
	.language-dropdown {
		display: block; // 强制显示
	}
	
	.settings-button {
		display: flex;
		align-items: center;
		gap: $space-xs;
	}
}

/* 响应式样式 */
@include responsive(md) {
	.header {
		.logo {
			font-size: $font-size-xl;
		}
	}
}

@include responsive(sm) {
	.header {
		.settings-button {
			span {
				display: none;
			}
		}
		
		.header-actions {
			gap: $space-sm;
		}
	}
}
</style> 