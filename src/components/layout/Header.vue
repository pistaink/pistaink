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
					<button id="languageButton" @click="handleLanguageButtonClick" class="language-button">
						{{ currentLanguage.toUpperCase() }}
					</button>
					
					<div 
						id="languageDropdown"
						class="language-dropdown-menu"
						style="display: none"
					>
						<div 
							v-for="lang in availableLanguages" 
							:key="lang" 
							@click="changeLanguage(lang, $event)"
							:class="['dropdown-item', { active: lang === currentLanguage }]"
						>
							{{ lang.toUpperCase() }}
						</div>
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
const isSettingsOpen = ref(false)

// 直接处理语言下拉菜单显示/隐藏
function handleLanguageButtonClick(event: MouseEvent) {
	event.stopPropagation();
	event.preventDefault();
	
	const dropdown = document.getElementById('languageDropdown');
	
	if (dropdown) {
		// 切换下拉菜单显示状态
		const isVisible = dropdown.style.display === 'block';
		
		if (!isVisible) {
			// 设置下拉菜单位置
			dropdown.style.display = 'block';
			dropdown.style.visibility = 'visible';
			dropdown.style.opacity = '1';
		} else {
			dropdown.style.display = 'none';
		}
	}
}

// 切换主题
function toggleTheme() {
	const modes: ['light', 'dark', 'auto'] = ['light', 'dark', 'auto']
	const currentIndex = modes.indexOf(themeMode.value)
	const nextIndex = (currentIndex + 1) % modes.length
	settingsStore.setThemeMode(modes[nextIndex])
}

// 切换语言
function changeLanguage(lang: string, event: MouseEvent) {
	event.stopPropagation();
	console.log('切换语言至:', lang);
	i18nStore.setLanguage(lang);
	
	// 隐藏下拉菜单
	const dropdown = document.getElementById('languageDropdown');
	if (dropdown) {
		dropdown.style.display = 'none';
	}
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
	const dropdown = document.getElementById('languageDropdown');
	const button = document.getElementById('languageButton');
	
	// 如果下拉菜单存在且显示中，且点击的不是下拉菜单或按钮
	if (dropdown && dropdown.style.display === 'block') {
		if (event.target instanceof Node && 
			!dropdown.contains(event.target as Node) && 
			!button?.contains(event.target as Node)) {
			console.log('关闭语言下拉菜单');
			dropdown.style.display = 'none';
		}
	}
}

// 添加和移除事件监听器
onMounted(() => {
	console.log('Header组件已挂载');
	document.addEventListener('click', handleClickOutside);
	
	// 移除自动显示语言下拉菜单的测试代码
	const dropdown = document.getElementById('languageDropdown');
	if (dropdown) {
		dropdown.style.display = 'none';
	}
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
	z-index: 999;
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
		z-index: 1500 !important; /* 增加z-index确保下拉菜单在上层 */
	}
	
	.language-button {
		font-weight: bold;
		padding: 8px 12px;
		border: 2px solid #3498db;
		border-radius: 4px;
		background-color: #f8f9fa;
		cursor: pointer;
	}
	
	.language-dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		z-index: 99999;
		background: white;
		border: 1px solid #ddd;
		min-width: 150px;
		padding: 8px;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
		margin-top: 4px;
	}
	
	.dropdown-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 8px 12px;
		margin-bottom: 4px;
		border: none;
		cursor: pointer;
		border-radius: 4px;
		background-color: transparent;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
		
		&.active {
			background-color: var(--primary-color, #007bff);
			color: white;
		}
	}
	
	.theme-button,
	.settings-button {
		background: transparent;
		color: var(--text-color, #333333);
		border: 1px solid var(--border-color, #e0e0e0);
		border-radius: 4px;
		padding: 6px 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 40px;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
	
	.settings-button {
		display: flex;
		align-items: center;
		gap: 4px;
	}
}

/* 响应式样式 */
@media (max-width: 768px) {
	.header {
		.logo {
			font-size: 24px;
		}
	}
}

@media (max-width: 576px) {
	.header {
		.settings-button {
			span {
				display: none;
			}
		}
		
		.header-actions {
			gap: 8px;
		}
	}
}
</style> 