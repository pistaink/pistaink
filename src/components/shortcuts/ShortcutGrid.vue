<template>
	<div class="shortcut-grid">
		<h2 class="grid-title">{{ t('shortcuts') }}</h2>
		
		<div class="shortcuts-container">
			<!-- 快捷方式列表 -->
			<div 
				v-for="shortcut in shortcuts" 
				:key="shortcut.id" 
				class="shortcut-item"
			>
				<a :href="shortcut.url" target="_blank" rel="noopener noreferrer" class="shortcut-link">
					<div class="shortcut-icon">
						<img :src="getShortcutIcon(shortcut)" :alt="getShortcutName(shortcut)" />
					</div>
					<div class="shortcut-name">
						{{ getShortcutName(shortcut) }}
					</div>
				</a>
				
				<button class="edit-button" @click="openEditModal(shortcut)">
					<span>⋮</span>
				</button>
			</div>
			
			<!-- 添加快捷方式按钮 -->
			<div class="shortcut-item add-shortcut" @click="openAddModal">
				<div class="add-icon">+</div>
				<div class="add-text">{{ t('add_shortcut') }}</div>
			</div>
		</div>
		
		<!-- 添加/编辑快捷方式模态框 -->
		<div v-if="isModalOpen" class="shortcut-modal">
			<div class="modal-backdrop" @click="closeModal"></div>
			<div class="modal-content">
				<div class="modal-header">
					<h3>{{ isEditing ? t('edit') : t('add_shortcut') }}</h3>
					<button class="close-button" @click="closeModal">&times;</button>
				</div>
				
				<div class="modal-body">
					<div class="form-group">
						<label for="shortcutName">{{ t('name') }}</label>
						<input id="shortcutName" v-model="currentShortcut.name[currentLanguage]" />
					</div>
					
					<div class="form-group">
						<label for="shortcutUrl">{{ t('url') }}</label>
						<input 
							id="shortcutUrl" 
							v-model="currentShortcut.url" 
							placeholder="https://example.com"
						/>
					</div>
				</div>
				
				<div class="modal-footer">
					<button 
						v-if="isEditing" 
						class="delete-button" 
						@click="confirmDelete"
					>
						{{ t('delete') }}
					</button>
					
					<div class="action-buttons">
						<button class="cancel-button" @click="closeModal">
							{{ t('cancel') }}
						</button>
						<button class="save-button" @click="saveShortcut">
							{{ t('save') }}
						</button>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 确认删除对话框 -->
		<div v-if="isDeleteConfirmOpen" class="confirm-modal">
			<div class="modal-backdrop" @click="cancelDelete"></div>
			<div class="modal-content confirm-content">
				<div class="confirm-message">
					{{ t('confirm_delete') }}
				</div>
				
				<div class="confirm-actions">
					<button class="cancel-button" @click="cancelDelete">
						{{ t('no') }}
					</button>
					<button class="delete-confirm-button" @click="deleteShortcut">
						{{ t('yes') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { IShortcut, ILocalizedString } from '@/types/models'
import { formatUrl } from '@/utils/helpers'

// 获取 store
const dataStore = useDataStore()
const i18nStore = useI18nStore()

// 获取翻译函数
const t = i18nStore.t

// 计算属性
const currentLanguage = computed(() => i18nStore.currentLanguage)
const shortcuts = computed(() => dataStore.shortcuts)

// 状态
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteConfirmOpen = ref(false)
const currentShortcut = ref<{
	id?: string;
	name: ILocalizedString;
	url: string;
}>({
	name: { [currentLanguage.value]: '' },
	url: ''
})

// 获取快捷方式名称
function getShortcutName(shortcut: IShortcut): string {
	return shortcut.name[currentLanguage.value] || Object.values(shortcut.name)[0] || ''
}

// 获取快捷方式图标
function getShortcutIcon(shortcut: IShortcut): string {
	// 如果有图标数据，使用图标数据
	if (shortcut.iconImageData) {
		return shortcut.iconImageData
	}
	
	// 如果有图标URL，使用图标URL
	if (shortcut.iconUrl) {
		return shortcut.iconUrl
	}
	
	// 否则使用默认图标
	// 这里使用谷歌favicon服务获取图标
	const domain = new URL(shortcut.url).hostname
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

// 打开添加快捷方式模态框
function openAddModal() {
	isEditing.value = false
	currentShortcut.value = {
		name: { [currentLanguage.value]: '' },
		url: ''
	}
	isModalOpen.value = true
}

// 打开编辑快捷方式模态框
function openEditModal(shortcut: IShortcut) {
	isEditing.value = true
	currentShortcut.value = {
		id: shortcut.id,
		name: { ...shortcut.name },
		url: shortcut.url
	}
	isModalOpen.value = true
}

// 关闭模态框
function closeModal() {
	isModalOpen.value = false
}

// 保存快捷方式
async function saveShortcut() {
	try {
		// 验证表单
		if (!currentShortcut.value.name[currentLanguage.value] || !currentShortcut.value.url) {
			alert('Please fill in all fields')
			return
		}
		
		// 格式化URL
		const url = formatUrl(currentShortcut.value.url)
		
		// 如果是编辑现有快捷方式
		if (isEditing.value && currentShortcut.value.id) {
			await dataStore.updateShortcut(currentShortcut.value.id, {
				name: currentShortcut.value.name,
				url
			})
		} else {
			// 否则添加新快捷方式
			await dataStore.addShortcut({
				name: currentShortcut.value.name,
				url
			})
		}
		
		// 关闭模态框
		closeModal()
	} catch (error) {
		console.error('Failed to save shortcut:', error)
		alert('Failed to save shortcut')
	}
}

// 确认删除快捷方式
function confirmDelete() {
	isDeleteConfirmOpen.value = true
}

// 取消删除
function cancelDelete() {
	isDeleteConfirmOpen.value = false
}

// 删除快捷方式
async function deleteShortcut() {
	try {
		if (currentShortcut.value.id) {
			await dataStore.deleteShortcut(currentShortcut.value.id)
			isDeleteConfirmOpen.value = false
			closeModal()
		}
	} catch (error) {
		console.error('Failed to delete shortcut:', error)
		alert('Failed to delete shortcut')
	}
}
</script>

<style lang="scss" scoped>
.shortcut-grid {
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: $space-md;
}

.grid-title {
	font-size: $font-size-lg;
	margin-bottom: $space-md;
	color: var(--text-color);
}

.shortcuts-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax($shortcut-size, 1fr));
	gap: $space-xl;
	margin-top: $space-md;
}

.shortcut-item {
	position: relative;
	width: $shortcut-size;
	height: $shortcut-size;
	background-color: var(--card-bg);
	border-radius: $border-radius-md;
	box-shadow: 0 2px 8px var(--shadow-color);
	overflow: hidden;
	transition: $transition-base;
	
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px var(--shadow-color);
		
		.edit-button {
			opacity: 1;
		}
	}
}

.shortcut-link {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	text-decoration: none;
	color: var(--text-color);
}

.shortcut-icon {
	width: 40px;
	height: 40px;
	margin-bottom: $space-sm;
	
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: $border-radius-sm;
	}
}

.shortcut-name {
	font-size: $font-size-sm;
	font-weight: $font-weight-normal;
	text-align: center;
	width: 90%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.edit-button {
	position: absolute;
	top: $space-xs;
	right: $space-xs;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.1);
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	opacity: 0;
	transition: $transition-fast;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}
}

.add-shortcut {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border: 2px dashed var(--border-color);
	background-color: transparent;
	
	&:hover {
		border-color: var(--primary-color);
		background-color: rgba(0, 0, 0, 0.02);
	}
	
	.add-icon {
		font-size: 32px;
		margin-bottom: $space-sm;
	}
	
	.add-text {
		font-size: $font-size-sm;
		color: var(--text-color-secondary);
	}
}

/* 模态框样式 */
.shortcut-modal,
.confirm-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-backdrop {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
	position: relative;
	width: 90%;
	max-width: 500px;
	background-color: var(--card-bg);
	border-radius: $border-radius-lg;
	box-shadow: 0 4px 20px var(--shadow-color);
	z-index: 1001;
	transform: translate(-50%, -50%);
	position: fixed;
	top: 50%;
	left: 50%;
}

.modal-header {
	padding: $space-md;
	border-bottom: 1px solid var(--border-color);
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	h3 {
		margin: 0;
		font-size: $font-size-lg;
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
}

.modal-footer {
	padding: $space-md;
	border-top: 1px solid var(--border-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.action-buttons {
	display: flex;
	gap: $space-sm;
}

.cancel-button,
.save-button,
.delete-button,
.delete-confirm-button {
	padding: $space-xs $space-md;
	border-radius: $border-radius-sm;
	cursor: pointer;
	font-size: $font-size-base;
}

.cancel-button {
	background-color: transparent;
	border: 1px solid var(--border-color);
	color: var(--text-color);
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
}

.save-button {
	background-color: var(--primary-color);
	color: white;
	border: none;
	
	&:hover {
		background-color: var(--primary-color-dark);
	}
}

.delete-button {
	background-color: transparent;
	color: var(--danger-color);
	border: 1px solid var(--danger-color);
	
	&:hover {
		background-color: rgba(231, 76, 60, 0.1);
	}
}

.delete-confirm-button {
	background-color: var(--danger-color);
	color: white;
	border: none;
	
	&:hover {
		opacity: 0.8;
	}
}

/* 确认对话框样式 */
.confirm-content {
	max-width: 400px;
	text-align: center;
}

.confirm-message {
	padding: $space-xl $space-md;
	font-size: $font-size-base;
	font-weight: $font-weight-bold;
}

.confirm-actions {
	padding: $space-md;
	border-top: 1px solid var(--border-color);
	display: flex;
	justify-content: center;
	gap: $space-md;
}

/* 响应式样式 */
@include responsive(sm) {
	.shortcuts-container {
		gap: $space-md;
	}
	
	.shortcut-item {
		width: 70px;
		height: 70px;
	}
	
	.shortcut-icon {
		width: 32px;
		height: 32px;
	}
	
	.shortcut-name {
		font-size: 12px;
	}
}
</style> 