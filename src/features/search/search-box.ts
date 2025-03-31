/**
 * 搜索框功能模块
 * 管理搜索框、搜索引擎选择器及搜索功能
 */

import dataManager from '../../core/data-manager';
import settingsManager from '../../core/settings-manager';
import eventBus from '../../core/event-bus';
import { SearchEngine } from '../../core/data-manager';
import { iconFetcher } from '../../utils';

// DOM元素选择器
const SEARCH_INPUT = '#search-input';
const SEARCH_BUTTON = '#search-button';
const SEARCH_ENGINE_SELECTOR = '#search-engine-selector';
const CURRENT_ENGINE_ICON = '#current-engine-icon';
const SEARCH_ENGINES_DROPDOWN = '#search-engines-dropdown';

// 当前搜索引擎
let currentEngine: SearchEngine;

/**
 * 初始化搜索功能
 */
export function initSearchFeature(): void {
  // 初始化DOM元素引用
  const searchInput = document.querySelector(SEARCH_INPUT) as HTMLInputElement;
  const searchButton = document.querySelector(SEARCH_BUTTON) as HTMLButtonElement;
  const engineSelector = document.querySelector(SEARCH_ENGINE_SELECTOR) as HTMLDivElement;
  const engineIcon = document.querySelector(CURRENT_ENGINE_ICON) as HTMLImageElement;
  const enginesDropdown = document.querySelector(SEARCH_ENGINES_DROPDOWN) as HTMLDivElement;

  if (!searchInput || !searchButton || !engineSelector || !engineIcon || !enginesDropdown) {
    console.error('无法找到搜索相关DOM元素');
    return;
  }

  // 设置初始搜索引擎
  currentEngine = dataManager.getDefaultEngine();
  updateEngineIcon(engineIcon, currentEngine);

  // 生成搜索引擎选项
  renderEngineOptions(enginesDropdown);

  // 绑定搜索事件
  searchButton.addEventListener('click', () => performSearch(searchInput.value));
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });

  // 绑定搜索引擎选择器事件
  engineSelector.addEventListener('click', () => {
    enginesDropdown.classList.toggle('show');
    // 如果显示，重新渲染搜索引擎选项以确保最新
    if (enginesDropdown.classList.contains('show')) {
      renderEngineOptions(enginesDropdown);
    }
  });

  // 点击其他区域关闭下拉列表
  document.addEventListener('click', (e) => {
    if (!engineSelector.contains(e.target as Node) && 
        !enginesDropdown.contains(e.target as Node)) {
      enginesDropdown.classList.remove('show');
    }
  });

  // 监听搜索引擎变更事件
  eventBus.subscribe('searchEngines:updated', () => {
    // 检查当前引擎是否还存在
    const engines = dataManager.getSearchEngines();
    if (!engines.find(engine => engine.id === currentEngine.id)) {
      currentEngine = dataManager.getDefaultEngine();
      updateEngineIcon(engineIcon, currentEngine);
    }
  });

  // 监听默认引擎变更事件
  eventBus.subscribe('defaultEngine:changed', (engineId) => {
    const engine = dataManager.getSearchEngineById(engineId as string);
    if (engine) {
      currentEngine = engine;
      updateEngineIcon(engineIcon, currentEngine);
    }
  });

  // 监听应用重初始化事件
  eventBus.subscribe('app:reinitialized', () => {
    currentEngine = dataManager.getDefaultEngine();
    updateEngineIcon(engineIcon, currentEngine);
    renderEngineOptions(enginesDropdown);
  });
}

/**
 * 更新搜索引擎图标
 * @param iconElement 图标元素
 * @param engine 搜索引擎
 */
async function updateEngineIcon(iconElement: HTMLImageElement, engine: SearchEngine): Promise<void> {
  // 优先使用已缓存的图标，没有则获取
  if (engine.iconImageData) {
    iconElement.src = engine.iconImageData;
  } else if (engine.iconUrl) {
    iconElement.src = engine.iconUrl;
  } else {
    // 从网站获取图标
    try {
      const iconUrl = await iconFetcher.fetchIcon(engine.url);
      iconElement.src = iconUrl;
      
      // 缓存图标
      dataManager.updateSearchEngine(engine.id, { iconUrl });
    } catch (error) {
      console.error('获取搜索引擎图标失败:', error);
      // 使用默认图标
      iconElement.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTE4LjAzMSAxNi42MTdsNGE0LjQgMTAgMCAweC0xLjI5IDEuMjlsLTQuMDAxLTQuMDAxQTcgNyAwIDExMTggMTFhNyA3IDAgMDEtMS4xNiAzLjlsNC4wMDEgNC4wMDJhNC40IDEwIDAgMHgtMS4yOS0xLjI5bC00LTR2LjAwMnpNNyAxMmE1IDUgMCAxMDAgMCA1IDUgMCAwwDAgMHoiLz48L3N2Zz4=';
    }
  }
}

/**
 * 渲染搜索引擎选项
 * @param container 容器元素
 */
function renderEngineOptions(container: HTMLElement): void {
  const engines = dataManager.getSearchEngines();
  const defaultLanguage = dataManager.getDefaultLanguage();
  
  // 清空现有内容
  container.innerHTML = '';
  
  // 添加搜索引擎选项
  engines.forEach(engine => {
    const engineOption = document.createElement('div');
    engineOption.className = 'engine-option';
    engineOption.dataset.engineId = engine.id;
    
    const engineImg = document.createElement('img');
    
    // 设置图标
    if (engine.iconImageData) {
      engineImg.src = engine.iconImageData;
    } else if (engine.iconUrl) {
      engineImg.src = engine.iconUrl;
    } else {
      // 异步加载图标
      iconFetcher.fetchIcon(engine.url).then(iconUrl => {
        engineImg.src = iconUrl;
        // 缓存图标
        dataManager.updateSearchEngine(engine.id, { iconUrl });
      });
    }
    
    const engineName = document.createElement('span');
    engineName.className = 'engine-name';
    engineName.textContent = engine.name[defaultLanguage] || Object.values(engine.name)[0];
    
    engineOption.appendChild(engineImg);
    engineOption.appendChild(engineName);
    
    // 绑定点击事件
    engineOption.addEventListener('click', () => {
      currentEngine = engine;
      
      // 更新当前引擎图标
      const currentEngineIcon = document.querySelector(CURRENT_ENGINE_ICON) as HTMLImageElement;
      updateEngineIcon(currentEngineIcon, engine);
      
      // 关闭下拉菜单
      container.classList.remove('show');
    });
    
    container.appendChild(engineOption);
  });
  
  // 添加"添加引擎"选项
  const addEngine = document.createElement('div');
  addEngine.className = 'engine-option add-engine';
  addEngine.innerHTML = '<span>+</span>';
  addEngine.addEventListener('click', () => {
    // 显示添加搜索引擎弹窗
    eventBus.publish('modal:show', 'engine-modal');
    // 关闭下拉菜单
    container.classList.remove('show');
  });
  
  container.appendChild(addEngine);
}

/**
 * 执行搜索
 * @param query 搜索查询
 */
function performSearch(query: string): void {
  if (!query.trim()) return;
  
  const settings = settingsManager.getSettings();
  
  // 检查是否是URL
  if (isUrl(query)) {
    const url = ensureHttpProtocol(query);
    openUrl(url, settings.searchOpensInNewTab);
    return;
  }
  
  // 构建搜索URL
  const searchUrl = buildSearchUrl(currentEngine.url, query);
  openUrl(searchUrl, settings.searchOpensInNewTab);
  
  // 清空搜索框
  const searchInput = document.querySelector(SEARCH_INPUT) as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }
}

/**
 * 检查字符串是否是URL
 * @param str 要检查的字符串
 * @returns 是否为URL
 */
function isUrl(str: string): boolean {
  // 简单URL检测
  return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(str);
}

/**
 * 确保URL有HTTP协议
 * @param url URL字符串
 * @returns 带有协议的URL
 */
function ensureHttpProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}

/**
 * 构建搜索URL
 * @param template 搜索URL模板
 * @param query 搜索查询
 * @returns 完整的搜索URL
 */
function buildSearchUrl(template: string, query: string): string {
  // 替换模板中的占位符
  if (template.includes('{query}')) {
    return template.replace('{query}', encodeURIComponent(query));
  }
  
  // 如果没有占位符，附加查询参数
  const separator = template.includes('?') ? '&' : '?';
  return `${template}${separator}q=${encodeURIComponent(query)}`;
}

/**
 * 打开URL
 * @param url URL字符串
 * @param newTab 是否在新标签页打开
 */
function openUrl(url: string, newTab: boolean): void {
  if (newTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
} 