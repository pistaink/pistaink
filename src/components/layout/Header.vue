<template>
	<header class="header">
		<div class="header-container">
			<h1 class="logo">{{ t('app_title') }}</h1>
			
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
function toggleLanguageDropdown() {
	isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
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
	const target = event.target as HTMLElement
	if (!target.closest('.language-selector')) {
		isLanguageDropdownOpen.value = false
	}
}

// 添加和移除事件监听器
onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	background-color: var(--card-bg);
	box-shadow: 0 2px 8px var(--shadow-color);
	position: sticky;
	top: 0;
	z-index: 100;
	padding: $space-sm $space-md;
	
	.header-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.logo {
		font-size: $font-size-lg;
		font-weight: $font-weight-bold;
		color: var(--primary-color);
		margin: 0;
	}
	
	.header-actions {
		display: flex;
		align-items: center;
		gap: $space-md;
	}
	
	.language-selector {
		position: relative;
	}
	
	.language-button,
	.theme-button,
	.settings-button {
		background: transparent;
		color: var(--text-color);
		border: 1px solid var(--border-color);
		border-radius: $border-radius-md;
		padding: $space-xs $space-sm;
		cursor: pointer;
		transition: $transition-base;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
	
	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: $space-xs;
		min-width: 120px;
		background-color: var(--dropdown-bg);
		border-radius: $border-radius-md;
		box-shadow: 0 2px 10px var(--shadow-color);
		overflow: hidden;
		z-index: 10;
	}
	
	.dropdown-item {
		display: block;
		width: 100%;
		padding: $space-xs $space-sm;
		text-align: left;
		background: transparent;
		border: none;
		color: var(--text-color);
		cursor: pointer;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
		
		&.active {
			background-color: var(--primary-color);
			color: white;
		}
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