<template>
  <div class="settings-tab-content">
    <h3>{{ i18nStore.t('general_settings') }}</h3>
    <div class="form-group">
      <label>{{ i18nStore.t('theme') }}</label>
      <div class="theme-options">
        <button 
          @click="settingsStore.setThemeMode('light')"
          :class="{ active: settingsStore.themeMode === 'light' }"
        >
          {{ i18nStore.t('light') }}
        </button>
        <button 
          @click="settingsStore.setThemeMode('dark')"
          :class="{ active: settingsStore.themeMode === 'dark' }"
        >
          {{ i18nStore.t('dark') }}
        </button>
        <button 
          @click="settingsStore.setThemeMode('auto')"
          :class="{ active: settingsStore.themeMode === 'auto' }"
        >
          {{ i18nStore.t('auto') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18nStore } from '@/stores/i18nStore'

const settingsStore = useSettingsStore()
const i18nStore = useI18nStore()
</script>

<style scoped>
.settings-tab-content h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
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
</style> 