/**
 * 设置管理器
 * 管理应用程序设置和界面偏好
 */

import { storage } from '../utils';
import eventBus from './event-bus';
import dataManager from './data-manager';

// 设置存储键
const SETTINGS_KEY = 'pistaink_settings';

// 设置类型
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  backgroundType: 'bing' | 'color' | 'custom';
  backgroundColor: string;
  backgroundImage: string;
  showGridLines: boolean;
  shortcutsPerRow: number;
  searchOpensInNewTab: boolean;
  shortcutOpensInNewTab: boolean;
}

// 默认设置
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  backgroundType: 'bing',
  backgroundColor: '#f5f5f5',
  backgroundImage: '',
  showGridLines: false,
  shortcutsPerRow: 5,
  searchOpensInNewTab: false,
  shortcutOpensInNewTab: true
};

class SettingsManager {
  private static instance: SettingsManager;
  private settings: AppSettings;

  private constructor() {
    // 从本地存储加载设置，或使用默认设置
    const storedSettings = storage.get<AppSettings>(SETTINGS_KEY);
    this.settings = storedSettings || { ...DEFAULT_SETTINGS };

    // 应用初始设置
    this.applyTheme();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  /**
   * 获取所有设置
   * @returns 设置对象
   */
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * 更新设置
   * @param partialSettings 部分设置对象
   */
  updateSettings(partialSettings: Partial<AppSettings>): void {
    const oldSettings = { ...this.settings };
    this.settings = { ...this.settings, ...partialSettings };

    // 保存到本地存储
    storage.set(SETTINGS_KEY, this.settings);

    // 发布事件
    eventBus.publish('settings:updated', this.settings);

    // 如果主题已更改，应用新主题
    if (oldSettings.theme !== this.settings.theme) {
      this.applyTheme();
    }
  }

  /**
   * 重置设置为默认值
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    storage.set(SETTINGS_KEY, this.settings);
    eventBus.publish('settings:updated', this.settings);
    this.applyTheme();
  }

  /**
   * 应用当前主题设置
   */
  applyTheme(): void {
    const { theme } = this.settings;

    // 移除现有主题
    document.documentElement.removeAttribute('data-theme');

    if (theme === 'auto') {
      // 自动模式下根据系统偏好设置主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      // 设置为用户选择的主题
      document.documentElement.setAttribute('data-theme', theme);
    }

    eventBus.publish('theme:changed', theme);
  }

  /**
   * 应用背景设置
   */
  async applyBackground(): Promise<void> {
    const { backgroundType, backgroundColor, backgroundImage } = this.settings;

    if (backgroundType === 'color') {
      // 纯色背景
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = backgroundColor;
    } else if (backgroundType === 'custom' && backgroundImage) {
      // 自定义图片背景
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    } else if (backgroundType === 'bing') {
      // 必应每日图片
      try {
        // 尝试获取必应每日图片
        const bingImageUrl = await this.fetchBingDailyImage();
        document.body.style.backgroundImage = `url(${bingImageUrl})`;
      } catch (error) {
        console.error('获取必应背景图片失败:', error);
        // 失败时使用默认颜色
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = DEFAULT_SETTINGS.backgroundColor;
      }
    }

    eventBus.publish('background:changed', backgroundType);
  }

  /**
   * 获取必应每日图片URL
   * @returns Promise，解析为图片URL
   */
  private async fetchBingDailyImage(): Promise<string> {
    try {
      // 由于跨域限制，直接使用必应API可能会失败
      // 这里使用一个代理或第三方API来获取图片
      // 实际项目中可能需要后端支持或使用CORS代理
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const bingUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';

      const response = await fetch(proxyUrl + encodeURIComponent(bingUrl));
      const data = await response.json();

      if (data && data.images && data.images.length > 0) {
        return 'https://www.bing.com' + data.images[0].url;
      }

      throw new Error('必应API返回格式无效');
    } catch (error) {
      console.error('获取必应图片失败:', error);
      throw new Error('无法获取必应每日图片');
    }
  }

  public getBackgroundColor(): string {
    return dataManager.exportSettings().background.color;
  }

  public setBackgroundColor(color: string): void {
    const settings = dataManager.exportSettings();
    settings.background.color = color;
    dataManager.importSettings(settings);
  }

  public getCustomBackground(): string {
    return dataManager.exportSettings().background.customUrl;
  }

  public setCustomBackground(url: string): void {
    const settings = dataManager.exportSettings();
    settings.background.customUrl = url;
    dataManager.importSettings(settings);
  }

  public getBackgroundType(): string {
    return dataManager.exportSettings().background.type;
  }

  public setBackgroundType(type: string): void {
    const settings = dataManager.exportSettings();
    settings.background.type = type;
    dataManager.importSettings(settings);
  }

  public getShowIcons(): boolean {
    return dataManager.exportSettings().display.showIcons;
  }

  public setShowIcons(show: boolean): void {
    const settings = dataManager.exportSettings();
    settings.display.showIcons = show;
    dataManager.importSettings(settings);
  }

  public getShowNames(): boolean {
    return dataManager.exportSettings().display.showNames;
  }

  public setShowNames(show: boolean): void {
    const settings = dataManager.exportSettings();
    settings.display.showNames = show;
    dataManager.importSettings(settings);
  }
}

export default SettingsManager.getInstance(); 