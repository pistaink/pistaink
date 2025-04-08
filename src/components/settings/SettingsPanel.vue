<template>
	<div v-if="modelValue" class="settings-modal" style="display: flex;">
		<div class="modal-backdrop" @click="closeSettings"></div>
		<div class="settings-content">
			<div class="settings-header">
				<h2>{{ i18nStore.t('settings') }}</h2>
				<button class="close-button" @click="closeSettings">&times;</button>
			</div>
			<div class="settings-body">
				<div class="settings-sidebar">
					<div 
						class="sidebar-item" 
						:class="{ active: currentTab === 'general' }"
						@click="currentTab = 'general'"
					>{{ i18nStore.t('general') }}</div>
					<div 
						class="sidebar-item" 
						:class="{ active: currentTab === 'search' }"
						@click="currentTab = 'search'"
					>{{ i18nStore.t('search') }}</div>
					<div 
						class="sidebar-item" 
						:class="{ active: currentTab === 'import' }"
						@click="currentTab = 'import'"
					>{{ i18nStore.t('import_export') }}</div>
					<div 
						class="sidebar-item" 
						:class="{ active: currentTab === 'language' }"
						@click="currentTab = 'language'"
					>{{ i18nStore.t('language') }}</div>
					<div 
						class="sidebar-item" 
						:class="{ active: currentTab === 'about' }"
						@click="currentTab = 'about'"
					>{{ i18nStore.t('about') }}</div>
				</div>
				<div class="settings-panel">
					<!-- 不同设置页面的内容 -->
					<keep-alive>
						<component :is="currentTabComponent" />
					</keep-alive>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18nStore } from '@/stores/i18nStore'
import GeneralSettings from './GeneralSettings.vue'
import AboutSettings from './AboutSettings.vue'
import SearchSettings from './SearchSettings.vue'
import ImportExportSettings from './ImportExportSettings.vue'
import LanguageSettings from './LanguageSettings.vue'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 定义组件事件
const emit = defineEmits(['update:modelValue'])

// 获取store
const settingsStore = useSettingsStore()
const i18nStore = useI18nStore()

// 设置面板状态
const currentTab = ref('general')

// 动态组件映射
const tabComponents: Record<string, any> = {
  'general': GeneralSettings,
  'search': SearchSettings,
  'import': ImportExportSettings,
  'language': LanguageSettings,
  'about': AboutSettings
}

// 当前选中的标签页组件
const currentTabComponent = computed(() => {
  return tabComponents[currentTab.value] || GeneralSettings
})

// 关闭设置面板
function closeSettings() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 设置面板基本样式，从App.vue提取 */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--modal-backdrop);
}

.settings-content {
  position: relative;
  width: 80%;
  max-width: 1000px;
  height: 80vh;
  background-color: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.settings-header h2 {
  color: var(--text-color);
  margin: 0;
}

.settings-body {
  display: flex;
  height: calc(100% - 60px);
}

.settings-sidebar {
  width: 200px;
  padding: 16px;
  border-right: 1px solid var(--border-color);
}

.sidebar-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-color);
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: var(--hover-color);
}

.sidebar-item.active {
  background-color: var(--primary-color);
  color: white;
}

.settings-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(80vh - 60px); /* 减去header高度 */
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--text-color);
}

.settings-tab-content {
  color: var(--text-color);
}

.settings-tab-content h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 16px;
}

.settings-tab-content p {
  color: var(--text-color);
}

.theme-options {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.theme-options button {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.theme-options button:hover {
  background: var(--hover-color);
}

.theme-options button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .settings-content {
    width: 95%;
    height: 90vh;
  }
  
  .settings-sidebar {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .settings-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .settings-body {
    flex-direction: column;
  }
  
  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 8px;
  }
  
  .sidebar-item {
    display: inline-block;
    margin-right: 4px;
    padding: 8px 12px;
  }
}
</style> 