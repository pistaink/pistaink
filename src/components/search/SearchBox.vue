<template>
	<div class="search-box">
		<div class="search-container">
			<!-- 搜索引擎选择器 -->
			<div class="engine-selector">
				<button id="engineButton" class="engine-button" @click="handleEngineButtonClick">
					<img :src="currentEngineIcon" :alt="currentEngineName" class="engine-icon" />
				</button>
				
				<!-- 下拉菜单始终存在于DOM中，但默认隐藏 -->
				<div id="engineDropdown" style="display: none; position: fixed; z-index: 99999; background: white; border: 1px solid #ddd; width: 350px; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); margin-top: 4px;">
					<div class="engine-grid">
						<button 
							v-for="engine in engines" 
							:key="engine.id" 
							class="engine-item"
							:class="{ active: engine.id === currentEngineId }"
							@click="selectEngine(engine.id, $event)"
							style="display: flex; flex-direction: column; align-items: center; padding: 8px;"
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
const isAddEngineModalOpen = ref(false)
const newEngine = ref<{
	name: ILocalizedString;
	url: string;
}>({
	name: { [currentLanguage.value]: '' },
	url: ''
})

// 直接处理下拉菜单显示隐藏
function handleEngineButtonClick(event: MouseEvent) {
	event.stopPropagation();
	const dropdown = document.getElementById('engineDropdown');
	const button = document.getElementById('engineButton');
	
	if (dropdown && button) {
		// 切换下拉菜单显示状态
		const isVisible = dropdown.style.display === 'block';
		
		if (!isVisible) {
			// 获取按钮位置
			const rect = button.getBoundingClientRect();
			// 设置下拉菜单位置
			dropdown.style.top = (rect.bottom + 4) + 'px';
			dropdown.style.left = rect.left + 'px';
			dropdown.style.display = 'block';
			console.log('显示下拉菜单，位置:', rect.left, rect.bottom);
		} else {
			dropdown.style.display = 'none';
		}
		
		console.log('切换引擎下拉菜单:', isVisible ? '隐藏' : '显示');
	}
}

// 选择搜索引擎
function selectEngine(id: string, event: MouseEvent) {
	event.stopPropagation();
	console.log('选择搜索引擎:', id);
	dataStore.setDefaultEngine(id);
	
	// 隐藏下拉菜单
	const dropdown = document.getElementById('engineDropdown');
	if (dropdown) {
		dropdown.style.display = 'none';
	}
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
	
	// 隐藏引擎下拉菜单
	const dropdown = document.getElementById('engineDropdown');
	if (dropdown) {
		dropdown.style.display = 'none';
	}
	
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
	const dropdown = document.getElementById('engineDropdown');
	const button = document.getElementById('engineButton');
	
	// 如果下拉菜单存在且显示中，且点击的不是下拉菜单或按钮
	if (dropdown && dropdown.style.display === 'block') {
		if (event.target instanceof Node && 
			!dropdown.contains(event.target as Node) && 
			!button?.contains(event.target as Node)) {
			console.log('关闭搜索引擎下拉菜单');
			dropdown.style.display = 'none';
		}
	}
}

// 添加和移除事件监听器
onMounted(() => {
	console.log('SearchBox组件已挂载');
	document.addEventListener('click', handleClickOutside);
	
	// 确保下拉菜单默认隐藏
	const dropdown = document.getElementById('engineDropdown');
	if (dropdown) {
		dropdown.style.display = 'none';
	}
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
})
</script>

<style lang="scss" scoped>
.search-box {
	width: 100%;
	max-width: 700px;
	margin: 2rem auto;
	position: relative;
}

.search-container {
	display: flex;
	align-items: center;
	background-color: var(--card-bg, #ffffff);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.engine-selector {
	position: relative;
	z-index: 1000 !important; /* 强制增加z-index */
}

.engine-button {
	background: transparent;
	border: none;
	padding: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 40px;
	min-height: 40px;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
}

.engine-icon {
	width: 24px;
	height: 24px;
	border-radius: 4px;
	object-fit: contain;
}

.engine-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	min-width: 300px;
	background-color: var(--card-bg, #ffffff);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	padding: 12px;
	z-index: 1001 !important; /* 强制增加z-index */
	margin-top: 4px;
	border: 1px solid var(--border-color, #e0e0e0);
	display: block !important; /* 强制显示 */
}

.engine-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px;
}

.engine-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8px;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 4px;
	cursor: pointer;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
		border-color: var(--border-color, #e0e0e0);
	}
	
	&.active {
		background-color: rgba(0, 0, 0, 0.1);
		border-color: var(--primary-color, #007bff);
	}
	
	.engine-name {
		margin-top: 4px;
		font-size: 14px;
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
	padding: 8px;
	background: transparent;
	border: 1px dashed var(--border-color, #e0e0e0);
	border-radius: 4px;
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
		margin-top: 4px;
		font-size: 14px;
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
	padding: 16px;
	font-size: 16px;
	
	&:focus {
		outline: none;
		box-shadow: none;
	}
}

.search-button {
	background-color: var(--primary-color, #3498db);
	color: white;
	border: none;
	padding: 16px;
	font-size: 16px;
	cursor: pointer;
	
	&:hover {
		background-color: var(--primary-color-dark, #2980b9);
	}
}

/* 模态框样式 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9998;
}

.modal-content {
	position: relative;
	background-color: var(--card-bg, #ffffff);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	width: 90%;
	max-width: 500px;
	z-index: 10000;
	display: flex;
	flex-direction: column;
}

.modal-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-color, #e0e0e0);
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
		color: var(--text-color-secondary, #666666);
		
		&:hover {
			color: var(--text-color, #333333);
		}
	}
}

.modal-body {
	padding: 16px;
}

.form-group {
	margin-bottom: 16px;
	
	label {
		display: block;
		margin-bottom: 4px;
		font-weight: bold;
	}
	
	input {
		width: 100%;
		padding: 8px;
		border: 1px solid var(--border-color, #e0e0e0);
		border-radius: 4px;
		
		&:focus {
			border-color: var(--primary-color, #3498db);
			outline: none;
		}
	}
	
	small {
		display: block;
		margin-top: 4px;
		color: var(--text-color-secondary, #666666);
		font-size: 14px;
	}
}

.modal-footer {
	padding: 16px;
	border-top: 1px solid var(--border-color, #e0e0e0);
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	
	.cancel-button {
		background-color: transparent;
		border: 1px solid var(--border-color, #e0e0e0);
		color: var(--text-color, #333333);
		padding: 4px 16px;
		border-radius: 4px;
		cursor: pointer;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
	
	.save-button {
		background-color: var(--primary-color, #3498db);
		color: white;
		border: none;
		padding: 4px 16px;
		border-radius: 4px;
		cursor: pointer;
		
		&:hover {
			background-color: var(--primary-color-dark, #2980b9);
		}
	}
}

/* 响应式样式 */
@media (max-width: 576px) {
	.search-button {
		padding: 8px 16px;
	}
	
	.engine-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style> 