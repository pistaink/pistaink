/**
 * 主应用入口文件
 * 初始化应用并启动所有核心功能
 */

import './assets/styles/main.css';
import dataManager from './core/data-manager';
import settingsManager from './core/settings-manager';
import eventBus from './core/event-bus';
import { initSearchFeature, initEngineManager } from './features/search';
import { initShortcuts } from './features/shortcuts';
import { initSettingsPanel, initThemeSwitch } from './features/ui';
import { initLanguageSwitch, applyLanguage } from './features/i18n';

// 初始化应用
async function initApp() {
  try {
    console.log('应用启动中...');
    
    // 先应用背景设置
    await settingsManager.applyBackground();
    
    // 初始化各功能模块
    initSearchFeature();
    initEngineManager();
    initShortcuts();
    initSettingsPanel();
    initThemeSwitch();
    initLanguageSwitch();
    
    // 应用当前语言
    applyLanguage(dataManager.getDefaultLanguage());
    
    // 监听数据导入事件，重新初始化界面
    eventBus.subscribe('data:imported', () => {
      // 重新应用语言
      applyLanguage(dataManager.getDefaultLanguage());
      
      // 通知各模块更新
      eventBus.publish('app:reinitialized');
    });
    
    console.log('应用启动完成');
  } catch (error) {
    console.error('应用初始化失败:', error);
    showErrorMessage('应用加载失败，请刷新页面重试');
  }
}

// 显示错误消息
function showErrorMessage(message: string) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
}

// 等待DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 监听全局错误
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  showErrorMessage('发生错误，请刷新页面重试');
}); 