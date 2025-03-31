/**
 * 主题管理模块
 * 处理主题切换和主题相关的UI设置
 */

import settingsManager from '../../core/settings-manager';
import eventBus from '../../core/event-bus';

// DOM元素选择器
const THEME_SWITCHER = '.theme-switcher';
const THEME_ICON = '.theme-icon';

/**
 * 初始化主题切换功能
 */
export function initThemeSwitch(): void {
  // 获取DOM元素
  const themeSwitcher = document.querySelector(THEME_SWITCHER);
  const themeIcon = document.querySelector(THEME_ICON);
  
  if (!themeSwitcher || !themeIcon) {
    console.error('无法找到主题切换元素');
    return;
  }
  
  // 初始化图标状态
  updateThemeIcon(themeIcon as HTMLElement, settingsManager.getSettings().theme);
  
  // 绑定点击事件
  themeSwitcher.addEventListener('click', toggleTheme);
  
  // 监听主题变更事件
  eventBus.subscribe('theme:changed', (theme) => {
    updateThemeIcon(themeIcon as HTMLElement, theme as string);
  });
  
  // 监听设置变更事件
  eventBus.subscribe('settings:updated', (settings) => {
    updateThemeIcon(themeIcon as HTMLElement, settings.theme);
  });
}

/**
 * 切换主题
 */
function toggleTheme(): void {
  const settings = settingsManager.getSettings();
  let newTheme: 'light' | 'dark' | 'auto';
  
  // 循环切换主题
  switch (settings.theme) {
    case 'light':
      newTheme = 'dark';
      break;
    case 'dark':
      newTheme = 'auto';
      break;
    case 'auto':
    default:
      newTheme = 'light';
      break;
  }
  
  // 更新设置
  settingsManager.updateSettings({ theme: newTheme });
}

/**
 * 更新主题图标
 * @param iconElement 图标元素
 * @param theme 主题类型
 */
function updateThemeIcon(iconElement: HTMLElement, theme: string): void {
  switch (theme) {
    case 'light':
      iconElement.textContent = '☀️';
      iconElement.setAttribute('title', '亮色模式（点击切换）');
      break;
    case 'dark':
      iconElement.textContent = '🌙';
      iconElement.setAttribute('title', '暗色模式（点击切换）');
      break;
    case 'auto':
      iconElement.textContent = '🔄';
      iconElement.setAttribute('title', '自动模式（点击切换）');
      break;
  }
} 