/**
 * 语言管理模块
 * 管理多语言设置和切换
 */

import dataManager from '../../core/data-manager';
import eventBus from '../../core/event-bus';
import { applyLanguage } from './language-apply';

// DOM元素选择器
const LANGUAGE_SWITCHER = '.language-switcher';
const CURRENT_LANGUAGE = '.current-language';

/**
 * 初始化语言切换功能
 */
export function initLanguageSwitch(): void {
  // 获取DOM元素
  const languageSwitcher = document.querySelector(LANGUAGE_SWITCHER);
  const currentLanguageElement = document.querySelector(CURRENT_LANGUAGE);
  
  if (!languageSwitcher || !currentLanguageElement) {
    console.error('无法找到语言切换元素');
    return;
  }
  
  // 初始化当前语言显示
  updateLanguageDisplay(currentLanguageElement as HTMLElement, dataManager.getDefaultLanguage());
  
  // 绑定点击事件
  languageSwitcher.addEventListener('click', toggleLanguage);
  
  // 监听语言变更事件
  eventBus.subscribe('defaultLanguage:changed', (langCode) => {
    updateLanguageDisplay(currentLanguageElement as HTMLElement, langCode as string);
    applyLanguage(langCode as string);
  });
  
  // 监听应用重初始化事件
  eventBus.subscribe('app:reinitialized', () => {
    updateLanguageDisplay(currentLanguageElement as HTMLElement, dataManager.getDefaultLanguage());
  });
}

/**
 * 切换语言
 */
function toggleLanguage(): void {
  const currentLanguage = dataManager.getDefaultLanguage();
  const languages = Object.keys(dataManager.getLanguages());
  
  // 找到当前语言在语言列表中的索引
  const currentIndex = languages.indexOf(currentLanguage);
  
  // 找到下一个语言
  const nextIndex = (currentIndex + 1) % languages.length;
  const nextLanguage = languages[nextIndex];
  
  // 设置新语言
  dataManager.setDefaultLanguage(nextLanguage);
}

/**
 * 更新语言显示
 * @param element 显示元素
 * @param langCode 语言代码
 */
function updateLanguageDisplay(element: HTMLElement, langCode: string): void {
  if (langCode === 'zh-CN') {
    element.textContent = '中';
    element.setAttribute('title', '当前语言：中文（点击切换）');
  } else if (langCode === 'en') {
    element.textContent = 'EN';
    element.setAttribute('title', 'Current Language: English (Click to Switch)');
  } else {
    element.textContent = langCode.toUpperCase();
    element.setAttribute('title', `Language: ${langCode} (Click to Switch)`);
  }
} 