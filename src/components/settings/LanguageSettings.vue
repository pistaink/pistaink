<template>
  <div class="settings-tab-content">
    <h3>{{ i18nStore.t('language') }}</h3>
    
    <div class="settings-section">
      <h4>{{ i18nStore.t('select_language') }}</h4>
      <p>{{ i18nStore.t('language_description') }}</p>
      
      <div class="language-options">
        <div
          v-for="lang in availableLanguages"
          :key="lang.code"
          class="language-option"
          :class="{ 'selected': currentLanguage === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          <div class="language-flag">{{ lang.flag }}</div>
          <div class="language-details">
            <div class="language-name">{{ lang.name }}</div>
            <div class="language-native">{{ lang.nativeName }}</div>
          </div>
          <div v-if="currentLanguage === lang.code" class="language-selected">
            ✓
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>{{ i18nStore.t('language_contributors') }}</h4>
      <p>{{ i18nStore.t('language_contributors_description') }}</p>
      
      <div class="contributors-list">
        <div v-for="(contributors, langCode) in languageContributors" :key="langCode" class="contributor-group">
          <div class="contributor-language">{{ getLanguageName(langCode) }} ({{ langCode }})</div>
          <div class="contributor-names">
            {{ contributors.join(', ') }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>{{ i18nStore.t('help_translate') }}</h4>
      <p v-html="i18nStore.t('translation_help_description')"></p>
      
      <div class="action-buttons">
        <a 
          href="https://github.com/yourusername/pistaink/blob/main/TRANSLATION.md" 
          target="_blank"
          class="primary-button"
        >
          {{ i18nStore.t('translation_guide') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18nStore'
import { useThemeStore } from '@/stores/themeStore'

const i18nStore = useI18nStore()
const themeStore = useThemeStore()

// 当前选中的语言
const currentLanguage = computed(() => i18nStore.currentLanguage)

// 可用语言列表
const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
]

// 各语言贡献者列表
const languageContributors = {
  en: ['John Doe', 'Jane Smith'],
  zh: ['Li Wei', 'Zhang Min'],
  es: ['Carlos Rodriguez', 'Maria Garcia'],
  fr: ['Jean Dupont', 'Marie Leclerc'],
  de: ['Hans Müller', 'Greta Schmidt'],
  ja: ['Tanaka Hiroshi', 'Suzuki Yuki'],
  ko: ['Kim Min-jun', 'Park Ji-hye'],
  ru: ['Ivan Petrov', 'Natasha Ivanova']
}

// 更改应用语言
function changeLanguage(langCode: string) {
  i18nStore.setLanguage(langCode)
  
  // 通知用户语言已更改
  setTimeout(() => {
    themeStore.showNotification({
      type: 'success',
      message: i18nStore.t('language_changed'),
      duration: 3000
    })
  }, 100)
}

// 获取语言名称
function getLanguageName(langCode: string) {
  const lang = availableLanguages.find(l => l.code === langCode)
  return lang ? lang.name : langCode
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

/* 语言选项列表 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.language-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  background-color: var(--hover-color);
  cursor: pointer;
  transition: all 0.2s;
}

.language-option:hover {
  background-color: var(--hover-color-dark);
}

.language-option.selected {
  background-color: var(--primary-color-light, rgba(52, 152, 219, 0.1));
  border: 1px solid var(--primary-color, #3498db);
}

.language-flag {
  font-size: 24px;
  margin-right: 16px;
}

.language-details {
  flex: 1;
}

.language-name {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
}

.language-native {
  font-size: 14px;
  color: var(--secondary-text-color);
}

.language-selected {
  color: var(--primary-color, #3498db);
  font-weight: bold;
  font-size: 18px;
}

/* 贡献者列表 */
.contributors-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.contributor-group {
  margin-bottom: 16px;
}

.contributor-language {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
}

.contributor-names {
  font-size: 14px;
  color: var(--secondary-text-color);
}

/* 按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
}

.primary-button:hover {
  background-color: var(--primary-color-dark, #2980b9);
}
</style> 