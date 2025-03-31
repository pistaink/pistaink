<template>
	<div class="search-box">
		<div class="search-container">
			<!-- 搜索引擎选择器 -->
			<div class="engine-selector">
				<button class="engine-button" @click="toggleEngineDropdown">
					<img :src="currentEngineIcon" :alt="currentEngineName" class="engine-icon" />
				</button>
				
				<div v-if="isEngineDropdownOpen" class="engine-dropdown">
					<div class="engine-grid">
						<button 
							v-for="engine in engines" 
							:key="engine.id" 
							class="engine-item"
							:class="{ active: engine.id === currentEngineId }"
							@click="selectEngine(engine.id)"
						>
							<img :src="getEngineIcon(engine)" :alt="getEngineName(engine)" class="engine-icon" />
							<span class="engine-name">{{ getEngineName(engine) }}</span>
						</button>
						
						<button class="add-engine-button" @click="openAddEngineModal">
							<span class="add-icon">+</span>
							<span class="add-text">{{ t('add_engine') }}</span>
						</button>
					</div>
				</div>
			</div>
			
			<!-- 搜索输入框 -->
			<div class="search-input-container">
				<input 
					v-model="searchQuery" 
					:placeholder="t('search_placeholder')" 
					class="search-input"
					@keydown.enter="search"
				/>
				
				<button class="search-button" @click="search">
					{{ t('search_button') }}
				</button>
			</div>
		</div>
		
		<!-- 添加搜索引擎模态框 -->
		<!-- 简化版本，实际项目中可以使用更复杂的组件 -->
		<div v-if="isAddEngineModalOpen" class="modal">
			<div class="modal-backdrop" @click="closeAddEngineModal"></div>
			<div class="modal-content">
				<div class="modal-header">
					<h3>{{ t('add_engine') }}</h3>
					<button class="close-button" @click="closeAddEngineModal">&times;</button>
				</div>
				
				<div class="modal-body">
					<div class="form-group">
						<label for="engineName">{{ t('name') }}</label>
						<input id="engineName" v-model="newEngine.name[currentLanguage]" />
					</div>
					
					<div class="form-group">
						<label for="engineUrl">{{ t('url') }}</label>
						<input 
							id="engineUrl" 
							v-model="newEngine.url" 
							placeholder="https://example.com/search?q={query}"
						/>
						<small>{{ t('use_{query}_placeholder') }}</small>
					</div>
				</div>
				
				<div class="modal-footer">
					<button class="cancel-button" @click="closeAddEngineModal">
						{{ t('cancel') }}
					</button>
					<button class="save-button" @click="saveNewEngine">
						{{ t('save') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ISearchEngine, ILocalizedString } from '@/types/models'
import { formatUrl } from '@/utils/helpers'

// 获取 store
const dataStore = useDataStore()
const i18nStore = useI18nStore()

// 获取翻译函数
const t = i18nStore.t

// 计算属性
const currentLanguage = computed(() => i18nStore.currentLanguage)
const engines = computed(() => dataStore.engines)
const currentEngineId = computed(() => dataStore.defaultEngine)

// 当前搜索引擎
const currentEngine = computed(() => {
	return engines.value.find(engine => engine.id === currentEngineId.value) || engines.value[0]
})

// 当前搜索引擎名称
const currentEngineName = computed(() => {
	if (!currentEngine.value) return ''
	return getEngineName(currentEngine.value)
})

// 当前搜索引擎图标
const currentEngineIcon = computed(() => {
	if (!currentEngine.value) return ''
	return getEngineIcon(currentEngine.value)
})

// 状态
const searchQuery = ref('')
const isEngineDropdownOpen = ref(false)
const isAddEngineModalOpen = ref(false)
const newEngine = ref<{
	name: ILocalizedString;
	url: string;
}>({
	name: { [currentLanguage.value]: '' },
	url: ''
})

// 选择搜索引擎
function selectEngine(id: string) {
	dataStore.setDefaultEngine(id)
	isEngineDropdownOpen.value = false
}

// 切换搜索引擎下拉菜单
function toggleEngineDropdown() {
	isEngineDropdownOpen.value = !isEngineDropdownOpen.value
}

// 获取搜索引擎名称
function getEngineName(engine: ISearchEngine): string {
	return engine.name[currentLanguage.value] || Object.values(engine.name)[0] || ''
}

// 获取搜索引擎图标
function getEngineIcon(engine: ISearchEngine): string {
	// 如果有图标数据，使用图标数据
	if (engine.iconImageData) {
		return engine.iconImageData
	}
	
	// 如果有图标URL，使用图标URL
	if (engine.iconUrl) {
		return engine.iconUrl
	}
	
	// 否则使用默认图标
	// 这里使用谷歌favicon服务获取图标
	const domain = new URL(engine.url).hostname
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

// 执行搜索
function search() {
	if (!searchQuery.value.trim() || !currentEngine.value) return
	
	const url = currentEngine.value.url.replace('{query}', encodeURIComponent(searchQuery.value))
	window.open(url, '_blank')
}

// 打开添加搜索引擎模态框
function openAddEngineModal() {
	isAddEngineModalOpen.value = true
	isEngineDropdownOpen.value = false
	
	// 重置表单
	newEngine.value = {
		name: { [currentLanguage.value]: '' },
		url: ''
	}
}

// 关闭添加搜索引擎模态框
function closeAddEngineModal() {
	isAddEngineModalOpen.value = false
}

// 保存新搜索引擎
async function saveNewEngine() {
	// 验证表单
	if (!newEngine.value.name[currentLanguage.value] || !newEngine.value.url) {
		alert('Please fill in all fields')
		return
	}
	
	// 格式化URL
	const url = formatUrl(newEngine.value.url)
	
	// 如果URL中没有{query}占位符，添加到末尾
	const finalUrl = url.includes('{query}')
		? url
		: url + (url.includes('?') ? '&q={query}' : '?q={query}')
	
	// 添加搜索引擎
	try {
		await dataStore.addEngine({
			name: newEngine.value.name,
			url: finalUrl
		})
		
		// 关闭模态框
		closeAddEngineModal()
	} catch (error) {
		console.error('Failed to add search engine:', error)
		alert('Failed to add search engine')
	}
}

// 点击外部关闭下拉菜单
function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement
	if (!target.closest('.engine-selector')) {
		isEngineDropdownOpen.value = false
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
.search-box {
	width: 100%;
	max-width: 700px;
	margin: 2rem auto;
}

.search-container {
	display: flex;
	align-items: center;
	background-color: var(--card-bg);
	border-radius: $border-radius-lg;
	box-shadow: 0 4px 12px var(--shadow-color);
	overflow: hidden;
}

.engine-selector {
	position: relative;
}

.engine-button {
	background: transparent;
	border: none;
	padding: $space-sm;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
}

.engine-icon {
	width: 24px;
	height: 24px;
	border-radius: $border-radius-sm;
}

.engine-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	min-width: 300px;
	background-color: var(--card-bg);
	border-radius: $border-radius-md;
	box-shadow: 0 4px 12px var(--shadow-color);
	padding: $space-md;
	z-index: 10;
}

.engine-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: $space-sm;
}

.engine-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: $space-sm;
	background: transparent;
	border: 1px solid transparent;
	border-radius: $border-radius-sm;
	cursor: pointer;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
		border-color: var(--border-color);
	}
	
	&.active {
		background-color: rgba(0, 0, 0, 0.1);
		border-color: var(--primary-color);
	}
	
	.engine-name {
		margin-top: $space-xs;
		font-size: $font-size-sm;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
}

.add-engine-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: $space-sm;
	background: transparent;
	border: 1px dashed var(--border-color);
	border-radius: $border-radius-sm;
	cursor: pointer;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	
	.add-icon {
		font-size: 24px;
		line-height: 24px;
		font-weight: bold;
	}
	
	.add-text {
		margin-top: $space-xs;
		font-size: $font-size-sm;
		text-align: center;
	}
}

.search-input-container {
	flex: 1;
	display: flex;
	align-items: center;
}

.search-input {
	flex: 1;
	border: none;
	padding: $space-md;
	font-size: $font-size-base;
	
	&:focus {
		outline: none;
		box-shadow: none;
	}
}

.search-button {
	background-color: var(--primary-color);
	color: white;
	border: none;
	padding: $space-md;
	font-size: $font-size-base;
	cursor: pointer;
	
	&:hover {
		background-color: var(--primary-color-dark);
	}
}

/* 模态框样式 */
.modal {
	position: relative;
	z-index: 100;
}

.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}

.modal-content {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: var(--card-bg);
	border-radius: $border-radius-lg;
	box-shadow: 0 4px 20px var(--shadow-color);
	width: 90%;
	max-width: 500px;
	z-index: 101;
}

.modal-header {
	padding: $space-md;
	border-bottom: 1px solid var(--border-color);
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	h3 {
		margin: 0;
	}
	
	.close-button {
		background: transparent;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: var(--text-color-secondary);
		
		&:hover {
			color: var(--text-color);
		}
	}
}

.modal-body {
	padding: $space-md;
}

.form-group {
	margin-bottom: $space-md;
	
	label {
		display: block;
		margin-bottom: $space-xs;
		font-weight: $font-weight-bold;
	}
	
	input {
		width: 100%;
		padding: $space-sm;
		border: 1px solid var(--border-color);
		border-radius: $border-radius-sm;
		
		&:focus {
			border-color: var(--primary-color);
			outline: none;
		}
	}
	
	small {
		display: block;
		margin-top: $space-xs;
		color: var(--text-color-secondary);
		font-size: $font-size-sm;
	}
}

.modal-footer {
	padding: $space-md;
	border-top: 1px solid var(--border-color);
	display: flex;
	justify-content: flex-end;
	gap: $space-sm;
	
	.cancel-button {
		background-color: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		padding: $space-xs $space-md;
		border-radius: $border-radius-sm;
		cursor: pointer;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
	
	.save-button {
		background-color: var(--primary-color);
		color: white;
		border: none;
		padding: $space-xs $space-md;
		border-radius: $border-radius-sm;
		cursor: pointer;
		
		&:hover {
			background-color: var(--primary-color-dark);
		}
	}
}

/* 响应式样式 */
@include responsive(sm) {
	.search-button {
		padding: $space-sm $space-md;
	}
	
	.engine-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style> 