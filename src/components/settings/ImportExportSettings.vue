<template>
  <div class="settings-tab-content">
    <h3>{{ i18nStore.t('import_export') }}</h3>
    
    <!-- 导出数据 -->
    <div class="settings-section">
      <h4>{{ i18nStore.t('export_data') }}</h4>
      <p>{{ i18nStore.t('export_description') }}</p>
      
      <div class="action-buttons">
        <button class="primary-button" @click="exportData">
          <span class="icon">↓</span> {{ i18nStore.t('export') }}
        </button>
      </div>
    </div>
    
    <!-- 导入数据 -->
    <div class="settings-section">
      <h4>{{ i18nStore.t('import_data') }}</h4>
      <p>{{ i18nStore.t('import_description') }}</p>
      
      <div class="file-upload">
        <label for="importFile" class="file-label">
          <span class="icon">↑</span> {{ i18nStore.t('select_file') }}
        </label>
        <input 
          type="file" 
          id="importFile" 
          accept=".json" 
          @change="handleFileUpload" 
          class="file-input"
        />
        <span v-if="selectedFileName" class="file-name">{{ selectedFileName }}</span>
      </div>
      
      <div v-if="selectedFileName" class="action-buttons">
        <button class="primary-button" @click="importData">
          {{ i18nStore.t('import') }}
        </button>
      </div>
    </div>
    
    <!-- 重置数据 -->
    <div class="settings-section danger-section">
      <h4>{{ i18nStore.t('reset_data') }}</h4>
      <p>{{ i18nStore.t('reset_description') }}</p>
      
      <div class="action-buttons">
        <button class="danger-button" @click="confirmReset">
          {{ i18nStore.t('reset_all_data') }}
        </button>
      </div>
    </div>
    
    <!-- 确认重置对话框 -->
    <div v-if="showResetConfirm" class="modal">
      <div class="modal-backdrop" @click="cancelReset"></div>
      <div class="modal-content confirm-content">
        <div class="confirm-message">
          {{ i18nStore.t('confirm_reset') }}
        </div>
        
        <div class="confirm-actions">
          <button class="cancel-button" @click="cancelReset">
            {{ i18nStore.t('no') }}
          </button>
          <button class="delete-confirm-button" @click="resetData">
            {{ i18nStore.t('yes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '@/stores/i18nStore'
import { storageService } from '@/services/storageService'

const i18nStore = useI18nStore()

// 文件上传
const selectedFile = ref<File | null>(null)
const selectedFileName = ref('')

// 确认重置
const showResetConfirm = ref(false)

// 导出数据
function exportData() {
  try {
    // 获取导出数据
    const exportedData = storageService.exportData()
    
    // 创建下载链接
    const blob = new Blob([exportedData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // 创建下载链接并模拟点击
    const a = document.createElement('a')
    a.href = url
    a.download = `pistaink_backup_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    
    // 清理
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error exporting data:', error)
    alert(i18nStore.t('export_failed'))
  }
}

// 处理文件上传
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    selectedFileName.value = input.files[0].name
  }
}

// 导入数据
function importData() {
  if (!selectedFile.value) {
    alert(i18nStore.t('select_file_first'))
    return
  }
  
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      if (e.target?.result) {
        const fileContent = e.target.result as string
        const success = storageService.importData(fileContent)
        
        if (success) {
          alert(i18nStore.t('import_success'))
          // 刷新页面以应用导入的设置
          window.location.reload()
        } else {
          alert(i18nStore.t('import_failed'))
        }
      }
    } catch (error) {
      console.error('Error importing data:', error)
      alert(i18nStore.t('import_failed'))
    }
  }
  
  reader.readAsText(selectedFile.value)
}

// 确认重置
function confirmReset() {
  showResetConfirm.value = true
}

// 取消重置
function cancelReset() {
  showResetConfirm.value = false
}

// 重置数据
function resetData() {
  try {
    storageService.clearAllData()
    alert(i18nStore.t('reset_success'))
    
    // 刷新页面以应用重置
    window.location.reload()
  } catch (error) {
    console.error('Error resetting data:', error)
    alert(i18nStore.t('reset_failed'))
  }
  
  showResetConfirm.value = false
}
</script>

<style scoped>
.settings-tab-content h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 24px;
}

.settings-section {
  margin-bottom: 32px;
  padding: 16px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.settings-section h4 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 8px;
}

.settings-section p {
  color: var(--secondary-text-color);
  margin-bottom: 16px;
}

.danger-section {
  border-color: rgba(231, 76, 60, 0.3);
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 16px;
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.primary-button:hover {
  background-color: var(--primary-color-dark, #2980b9);
}

.danger-button {
  padding: 8px 16px;
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.danger-button:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.icon {
  font-size: 16px;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.file-label:hover {
  background-color: var(--hover-color);
}

.file-input {
  display: none;
}

.file-name {
  font-size: 14px;
  color: var(--text-color);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  max-width: 400px;
  background-color: var(--modal-bg);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2001;
}

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

.cancel-button {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
}

.delete-confirm-button {
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style> 