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
	padding: 16px;
}

.grid-title {
	font-size: 18px;
	margin-bottom: 16px;
	color: var(--text-color);
}

.shortcuts-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 16px;
}

.shortcut-item {
	position: relative;
	background-color: var(--bg-color);
	border-radius: 8px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: all 0.2s;
	border: 1px solid var(--border-color);
	
	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		
		.edit-button {
			opacity: 1;
		}
	}
}

.shortcut-link {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-decoration: none;
	width: 100%;
}

.shortcut-icon {
	width: 48px;
	height: 48px;
	margin-bottom: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.shortcut-name {
	font-size: 14px;
	text-align: center;
	color: var(--text-color);
	word-break: break-word;
	max-width: 100%;
}

.edit-button {
	position: absolute;
	top: 8px;
	right: 8px;
	width: 24px;
	height: 24px;
	background: none;
	border: none;
	opacity: 0;
	transition: opacity 0.2s;
	cursor: pointer;
	padding: 0;
	font-size: 18px;
	color: var(--text-color);
}

.add-shortcut {
	cursor: pointer;
	border: 1px dashed var(--border-color);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	
	&:hover {
		background-color: var(--hover-color);
	}
}

.add-icon {
	font-size: 24px;
	margin-bottom: 8px;
	color: var(--text-color);
}

.add-text {
	font-size: 14px;
	color: var(--text-color);
}

/* 模态框样式 */
.shortcut-modal, .confirm-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--modal-backdrop);
}

.modal-content {
	position: relative;
	width: 90%;
	max-width: 400px;
	background-color: var(--modal-bg);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	z-index: 1001;
}

.modal-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-color);
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.modal-header h3 {
	margin: 0;
	color: var(--text-color);
}

.close-button {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: var(--text-color);
}

.modal-body {
	padding: 16px;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	color: var(--text-color);
}

.form-group input {
	width: 100%;
	padding: 8px;
	border: 1px solid var(--border-color);
	border-radius: 4px;
	background-color: var(--bg-color);
	color: var(--text-color);
}

.modal-footer {
	padding: 16px;
	border-top: 1px solid var(--border-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.action-buttons {
	display: flex;
	gap: 8px;
}

.cancel-button, .save-button, .delete-button, .delete-confirm-button {
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
}

.cancel-button {
	background-color: transparent;
	border: 1px solid var(--border-color);
	color: var(--text-color);
}

.save-button {
	background-color: var(--primary-color);
	border: none;
	color: white;
}

.delete-button {
	background-color: transparent;
	border: 1px solid #e74c3c;
	color: #e74c3c;
}

.delete-confirm-button {
	background-color: #e74c3c;
	border: none;
	color: white;
}

/* 确认删除对话框 */
.confirm-content {
	padding: 24px;
	text-align: center;
}

.confirm-message {
	margin-bottom: 24px;
	font-size: 16px;
	color: var(--text-color);
}

.confirm-actions {
	display: flex;
	justify-content: center;
	gap: 16px;
}
</style> 