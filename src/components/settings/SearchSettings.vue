<template>
  <div class="settings-tab-content">
    <h3>{{ i18nStore.t('search_settings') }}</h3>
    
    <!-- 搜索引擎列表 -->
    <div class="engine-list">
      <div class="section-header">
        <h4>{{ i18nStore.t('search_engines') }}</h4>
        <button class="add-button" @click="showAddEngineModal = true">
          <span>+</span> {{ i18nStore.t('add_engine') }}
        </button>
      </div>
      
      <div v-if="dataStore.engines.length === 0" class="empty-state">
        {{ i18nStore.t('no_search_engines') }}
      </div>
      
      <div v-else class="engine-items">
        <div 
          v-for="engine in dataStore.engines" 
          :key="engine.id"
          class="engine-item"
        >
          <div class="engine-info">
            <img :src="getEngineIcon(engine)" :alt="getEngineName(engine)" class="engine-icon" />
            <div class="engine-details">
              <div class="engine-name">{{ getEngineName(engine) }}</div>
              <div class="engine-url">{{ formatEngineUrl(engine.url) }}</div>
            </div>
          </div>
          
          <div class="engine-actions">
            <button 
              class="default-button" 
              :class="{ active: dataStore.defaultEngine === engine.id }"
              @click="setDefaultEngine(engine.id)"
            >
              {{ i18nStore.t('default') }}
            </button>
            <button class="edit-button" @click="editEngine(engine)">
              {{ i18nStore.t('edit') }}
            </button>
            <button class="delete-button" @click="confirmDeleteEngine(engine)">
              {{ i18nStore.t('delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑搜索引擎模态框 -->
    <div v-if="showAddEngineModal || editEngineData" class="modal">
      <div class="modal-backdrop" @click="cancelEngineModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editEngineData ? i18nStore.t('edit_engine') : i18nStore.t('add_engine') }}</h3>
          <button class="close-button" @click="cancelEngineModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ i18nStore.t('name') }}</label>
            <input v-model="engineForm.name[i18nStore.currentLanguage]" type="text" />
          </div>
          
          <div class="form-group">
            <label>{{ i18nStore.t('url') }}</label>
            <input 
              v-model="engineForm.url" 
              type="text" 
              placeholder="https://example.com/search?q={query}"
            />
            <small>{{ i18nStore.t('use_{query}_placeholder') }}</small>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="cancelEngineModal">
            {{ i18nStore.t('cancel') }}
          </button>
          <button class="save-button" @click="saveEngine">
            {{ i18nStore.t('save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除对话框 -->
    <div v-if="engineToDelete" class="modal">
      <div class="modal-backdrop" @click="cancelDelete"></div>
      <div class="modal-content confirm-content">
        <div class="confirm-message">
          {{ i18nStore.t('confirm_delete_engine') }}
        </div>
        
        <div class="confirm-actions">
          <button class="cancel-button" @click="cancelDelete">
            {{ i18nStore.t('no') }}
          </button>
          <button class="delete-confirm-button" @click="deleteEngine">
            {{ i18nStore.t('yes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ISearchEngine, ILocalizedString } from '@/types/models'

const dataStore = useDataStore()
const i18nStore = useI18nStore()

// 模态框状态
const showAddEngineModal = ref(false)
const editEngineData = ref<ISearchEngine | null>(null)
const engineToDelete = ref<ISearchEngine | null>(null)

// 表单数据
const engineForm = ref<{
  id?: string;
  name: ILocalizedString;
  url: string;
}>({
  name: { [i18nStore.currentLanguage]: '' },
  url: ''
})

// 获取搜索引擎名称
function getEngineName(engine: ISearchEngine): string {
  return engine.name[i18nStore.currentLanguage] || Object.values(engine.name)[0] || ''
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

// 格式化搜索引擎URL
function formatEngineUrl(url: string): string {
  return url.length > 50 ? url.substring(0, 47) + '...' : url
}

// 设置默认搜索引擎
function setDefaultEngine(id: string) {
  dataStore.setDefaultEngine(id)
}

// 编辑搜索引擎
function editEngine(engine: ISearchEngine) {
  editEngineData.value = engine
  engineForm.value = {
    id: engine.id,
    name: { ...engine.name },
    url: engine.url
  }
}

// 确认删除搜索引擎
function confirmDeleteEngine(engine: ISearchEngine) {
  engineToDelete.value = engine
}

// 取消删除
function cancelDelete() {
  engineToDelete.value = null
}

// 删除搜索引擎
async function deleteEngine() {
  if (engineToDelete.value?.id) {
    await dataStore.deleteEngine(engineToDelete.value.id)
    engineToDelete.value = null
  }
}

// 保存搜索引擎
async function saveEngine() {
  try {
    // 验证表单
    if (!engineForm.value.name[i18nStore.currentLanguage] || !engineForm.value.url) {
      alert(i18nStore.t('fill_all_fields'))
      return
    }
    
    // 格式化URL
    let url = engineForm.value.url
    
    // 如果URL中没有{query}占位符，添加到末尾
    if (!url.includes('{query}')) {
      url += (url.includes('?') ? '&q={query}' : '?q={query}')
    }
    
    // 如果是编辑现有搜索引擎
    if (editEngineData.value && engineForm.value.id) {
      await dataStore.updateEngine(engineForm.value.id, {
        name: engineForm.value.name,
        url
      })
    } else {
      // 否则添加新搜索引擎
      await dataStore.addEngine({
        name: engineForm.value.name,
        url
      })
    }
    
    // 关闭模态框
    cancelEngineModal()
  } catch (error) {
    console.error('Failed to save search engine:', error)
    alert(i18nStore.t('save_failed'))
  }
}

// 取消模态框
function cancelEngineModal() {
  showAddEngineModal.value = false
  editEngineData.value = null
  engineForm.value = {
    name: { [i18nStore.currentLanguage]: '' },
    url: ''
  }
}
</script>

<style scoped>
.settings-tab-content h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  color: var(--text-color);
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: var(--primary-color-dark, #2980b9);
}

.empty-state {
  padding: 24px;
  text-align: center;
  background-color: var(--hover-color);
  border-radius: 4px;
  color: var(--secondary-text-color);
}

.engine-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.engine-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.engine-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.engine-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.engine-details {
  display: flex;
  flex-direction: column;
}

.engine-name {
  font-weight: bold;
  color: var(--text-color);
}

.engine-url {
  font-size: 12px;
  color: var(--secondary-text-color);
  margin-top: 4px;
}

.engine-actions {
  display: flex;
  gap: 8px;
}

.default-button, .edit-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.default-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.default-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.edit-button {
  background-color: var(--hover-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.delete-button {
  background-color: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
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
  max-width: 500px;
  background-color: var(--modal-bg);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
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
  color: var(--input-text-color);
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: var(--secondary-text-color);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--border-color);
  gap: 8px;
}

.cancel-button, .save-button {
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

.delete-confirm-button {
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .engine-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .engine-actions {
    margin-top: 12px;
    align-self: flex-end;
  }
}
</style> 