<template>
  <div class="settings-tab-content">
    <h3>{{ i18nStore.t('about') }}</h3>
    <p>pistaink.com - v1.0.0</p>
    <div class="about-info">
      <p>{{ i18nStore.t('about_description') }}</p>
      <div class="links">
        <a href="https://github.com/your-username/pistaink" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18nStore'

const i18nStore = useI18nStore()
</script>

<style scoped>
.settings-tab-content h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 16px;
}

.settings-tab-content p {
  color: var(--text-color);
  margin-bottom: 16px;
}

.about-info {
  margin-top: 24px;
}

.links {
  margin-top: 16px;
}

.links a {
  color: var(--primary-color);
  text-decoration: none;
  margin-right: 16px;
}

.links a:hover {
  text-decoration: underline;
}
</style> 