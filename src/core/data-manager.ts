/**
 * 数据管理器
 * 负责管理应用程序的数据状态和持久化
 */

import { storage } from '../utils';
import eventBus from './event-bus';

// 数据存储键
const STORAGE_KEY = 'pistaink_data';

// 默认数据URL
const DEFAULT_DATA_URL = '/static/default.json';

// 数据类型定义
export interface ISearchEngine {
  id: string;
  name: Record<string, string>;
  url: string;
  iconUrl: string;
}

export interface ISettings {
  searchEngines: ISearchEngine[];
  defaultEngine: string;
  defaultLanguage: string;
  background: {
    type: string;
    color: string;
    customUrl: string;
  };
  display: {
    showIcons: boolean;
    showNames: boolean;
  };
}

export interface Shortcut {
  id: string;
  name: Record<string, string>;
  url: string;
  iconUrl?: string;
  iconImageData?: string;
}

export interface AppData {
  defaultEngine: string;
  defaultLanguage: string;
  engines: ISearchEngine[];
  shortcuts: Shortcut[];
  languages: Record<string, Record<string, string>>;
}

class DataManager {
  private data: AppData | null = null;
  private isLoading = false;
  private settings: ISettings;
  private static instance: DataManager;

  private constructor() {
    this.settings = this.loadSettings();
    // 加载数据
    this.loadData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadSettings(): ISettings {
    const defaultSettings: ISettings = {
      searchEngines: [],
      defaultEngine: '',
      defaultLanguage: 'zh-CN',
      background: {
        type: 'color',
        color: '#ffffff',
        customUrl: ''
      },
      display: {
        showIcons: true,
        showNames: true
      }
    };

    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  }

  private saveSettings(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  public exportSettings(): ISettings {
    return { ...this.settings };
  }

  public importSettings(settings: ISettings): void {
    this.settings = settings;
    this.saveSettings();
  }

  /**
   * 获取完整数据对象
   * @returns 数据对象
   */
  getData(): AppData {
    if (!this.data) {
      throw new Error('数据未加载');
    }
    return this.data;
  }

  /**
   * 获取所有搜索引擎
   * @returns 搜索引擎数组
   */
  getSearchEngines(): ISearchEngine[] {
    return [...this.settings.searchEngines];
  }

  /**
   * 通过ID获取搜索引擎
   * @param id 搜索引擎ID
   * @returns 搜索引擎对象或undefined
   */
  getSearchEngine(id: string): ISearchEngine | undefined {
    return this.settings.searchEngines.find(engine => engine.id === id);
  }

  /**
   * 获取默认搜索引擎
   * @returns 默认搜索引擎
   */
  getDefaultEngine(): string {
    return this.settings.defaultEngine;
  }

  /**
   * 设置默认搜索引擎
   * @param engineId 搜索引擎ID
   */
  setDefaultEngine(engineId: string): void {
    this.settings.defaultEngine = engineId;
    this.saveSettings();
  }

  /**
   * 添加搜索引擎
   * @param engine 搜索引擎对象
   */
  addSearchEngine(engine: ISearchEngine): void {
    this.settings.searchEngines.push(engine);
    this.saveSettings();
  }

  /**
   * 更新搜索引擎
   * @param engine 搜索引擎对象
   */
  updateSearchEngine(engine: ISearchEngine): void {
    const index = this.settings.searchEngines.findIndex(e => e.id === engine.id);
    if (index !== -1) {
      this.settings.searchEngines[index] = engine;
      this.saveSettings();
    }
  }

  /**
   * 删除搜索引擎
   * @param id 搜索引擎ID
   */
  deleteSearchEngine(id: string): void {
    this.settings.searchEngines = this.settings.searchEngines.filter(e => e.id !== id);
    this.saveSettings();
  }

  /**
   * 获取所有快捷方式
   * @returns 快捷方式数组
   */
  getShortcuts(): Shortcut[] {
    return this.getData().shortcuts;
  }

  /**
   * 通过ID获取快捷方式
   * @param id 快捷方式ID
   * @returns 快捷方式对象或undefined
   */
  getShortcutById(id: string): Shortcut | undefined {
    return this.getShortcuts().find(shortcut => shortcut.id === id);
  }

  /**
   * 添加快捷方式
   * @param shortcut 快捷方式对象
   */
  addShortcut(shortcut: Shortcut): void {
    // 确保ID不重复
    if (this.getShortcutById(shortcut.id)) {
      throw new Error(`快捷方式ID已存在: ${shortcut.id}`);
    }

    this.data!.shortcuts.push(shortcut);
    this.saveData();
    eventBus.publish('shortcuts:updated', this.getShortcuts());
  }

  /**
   * 更新快捷方式
   * @param shortcutId 快捷方式ID
   * @param updatedShortcut 更新后的快捷方式对象
   */
  updateShortcut(shortcutId: string, updatedShortcut: Partial<Shortcut>): void {
    const index = this.data!.shortcuts.findIndex(shortcut => shortcut.id === shortcutId);
    if (index === -1) {
      throw new Error(`快捷方式不存在: ${shortcutId}`);
    }

    // 更新快捷方式，保留ID
    this.data!.shortcuts[index] = {
      ...this.data!.shortcuts[index],
      ...updatedShortcut,
      id: shortcutId // 确保ID不变
    };

    this.saveData();
    eventBus.publish('shortcuts:updated', this.getShortcuts());
  }

  /**
   * 删除快捷方式
   * @param shortcutId 快捷方式ID
   */
  deleteShortcut(shortcutId: string): void {
    const index = this.data!.shortcuts.findIndex(shortcut => shortcut.id === shortcutId);
    if (index === -1) {
      throw new Error(`快捷方式不存在: ${shortcutId}`);
    }

    this.data!.shortcuts.splice(index, 1);
    this.saveData();
    eventBus.publish('shortcuts:updated', this.getShortcuts());
  }

  /**
   * 获取所有语言
   * @returns 语言对象
   */
  getLanguages(): string[] {
    return ['zh-CN', 'en'];
  }

  /**
   * 获取默认语言
   * @returns 默认语言代码
   */
  getDefaultLanguage(): string {
    return this.settings.defaultLanguage;
  }

  /**
   * 设置默认语言
   * @param language 语言代码
   */
  setDefaultLanguage(language: string): void {
    this.settings.defaultLanguage = language;
    this.saveSettings();
  }

  /**
   * 导出数据
   * @returns 数据JSON字符串
   */
  exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  /**
   * 导入数据
   * @param jsonData JSON数据字符串
   */
  importData(jsonData: string): void {
    try {
      const newData = JSON.parse(jsonData) as AppData;

      // 验证数据
      if (!this.validateData(newData)) {
        throw new Error('数据格式无效');
      }

      this.data = newData;
      this.saveData();

      // 通知所有相关组件数据已更新
      eventBus.publish('data:imported');
      eventBus.publish('searchEngines:updated', this.getSearchEngines());
      eventBus.publish('shortcuts:updated', this.getShortcuts());
      eventBus.publish('defaultEngine:changed', this.settings.defaultEngine);
      eventBus.publish('defaultLanguage:changed', this.settings.defaultLanguage);
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error(`导入数据失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 重置为默认数据
   */
  async resetToDefault(): Promise<void> {
    try {
      const response = await fetch(DEFAULT_DATA_URL);
      const defaultData = await response.json();

      this.importData(JSON.stringify(defaultData));
    } catch (error) {
      console.error('重置数据失败:', error);
      throw new Error('重置数据失败');
    }
  }

  /**
   * 加载数据
   */
  private async loadData(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      // 尝试从本地存储加载
      const storedData = storage.get<AppData>(STORAGE_KEY);

      if (storedData && this.validateData(storedData)) {
        this.data = storedData;
        eventBus.publish('data:loaded', this.data);
        return;
      }

      // 如果没有存储数据或数据无效，加载默认数据
      await this.resetToDefault();
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 保存数据到本地存储
   */
  private saveData(): void {
    if (!this.data) return;
    storage.set(STORAGE_KEY, this.data);
  }

  /**
   * 验证数据格式是否有效
   * @param data 要验证的数据
   * @returns 是否有效
   */
  private validateData(data: any): data is AppData {
    if (!data) return false;
    if (typeof data !== 'object') return false;
    if (!Array.isArray(data.engines)) return false;
    if (!Array.isArray(data.shortcuts)) return false;
    if (typeof data.defaultEngine !== 'string') return false;
    if (typeof data.defaultLanguage !== 'string') return false;
    if (typeof data.languages !== 'object') return false;

    return true;
  }
}

// 导出单例
export default DataManager.getInstance(); 