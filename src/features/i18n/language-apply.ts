/**
 * 语言应用模块
 * 负责将多语言文本应用到界面元素
 */

import dataManager from '../../core/data-manager';
import eventBus from '../../core/event-bus';

// i18n标签选择器
const I18N_SELECTOR = '[data-i18n]';

/**
 * 应用语言到界面
 * @param langCode 语言代码
 */
export function applyLanguage(langCode: string): void {
  const languages = dataManager.getLanguages();
  const texts = languages[langCode];
  
  if (!texts) {
    console.error(`语言未找到: ${langCode}`);
    return;
  }
  
  // 查找所有具有data-i18n属性的元素
  const elements = document.querySelectorAll(I18N_SELECTOR);
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key && texts[key]) {
      // 更新元素文本
      element.textContent = texts[key];
    }
  });
  
  // 更新特定元素（可能没有data-i18n属性）
  updateSpecificElements(texts);
  
  // 发布语言已应用事件
  eventBus.publish('language:applied', langCode);
}

/**
 * 更新特定元素的文本
 * @param texts 文本对象
 */
function updateSpecificElements(texts: Record<string, string>): void {
  // 更新页面标题
  if (texts['page_title']) {
    document.title = texts['page_title'];
  }
  
  // 更新搜索框占位符
  const searchInput = document.querySelector('#search-input') as HTMLInputElement;
  if (searchInput && texts['search_placeholder']) {
    searchInput.placeholder = texts['search_placeholder'];
  }
  
  // 更新设置面板标题
  const settingsTitle = document.querySelector('.settings-header h2');
  if (settingsTitle && texts['settings_title']) {
    settingsTitle.textContent = texts['settings_title'];
  }
  
  // 更新返回按钮
  const backButton = document.querySelector('.back-button');
  if (backButton && texts['back_button']) {
    backButton.textContent = texts['back_button'];
  }
  
  // 更新完成按钮
  const doneButton = document.querySelector('.done-button');
  if (doneButton && texts['done_button']) {
    doneButton.textContent = texts['done_button'];
  }
} 