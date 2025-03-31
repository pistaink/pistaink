/**
 * 设置面板模块
 * 管理设置面板的显示、隐藏和各项设置功能
 */

import dataManager from '../../core/data-manager';
import settingsManager from '../../core/settings-manager';
import eventBus from '../../core/event-bus';
import { generateId } from '../../utils';

// DOM元素选择器
const SETTINGS_BUTTON = '.settings-button';
const SETTINGS_PANEL = '#settings-panel';
const BACK_BUTTON = '.back-button';
const DONE_BUTTON = '.done-button';
const SETTINGS_SIDEBAR = '.settings-sidebar li';
const SETTINGS_MAIN = '.settings-main';

// 当前选中的设置项
let currentSection = 'import-export';

/**
 * 初始化设置面板
 */
export function initSettingsPanel(): void {
  // 获取DOM元素
  const settingsButton = document.querySelector(SETTINGS_BUTTON);
  const settingsPanel = document.querySelector(SETTINGS_PANEL) as HTMLElement;
  const backButton = document.querySelector(BACK_BUTTON);
  const doneButton = document.querySelector(DONE_BUTTON);
  const sidebarItems = document.querySelectorAll(SETTINGS_SIDEBAR);
  
  if (!settingsButton || !settingsPanel || !backButton || !doneButton) {
    console.error('无法找到设置面板相关元素');
    return;
  }
  
  // 绑定打开设置面板事件
  settingsButton.addEventListener('click', () => {
    settingsPanel.classList.add('show');
    renderSettingsContent(currentSection);
  });
  
  // 绑定关闭设置面板事件
  backButton.addEventListener('click', () => {
    settingsPanel.classList.remove('show');
  });
  
  doneButton.addEventListener('click', () => {
    settingsPanel.classList.remove('show');
  });
  
  // 绑定侧边栏点击事件
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const section = (e.currentTarget as HTMLElement).dataset.section;
      if (section) {
        // 更新选中项
        sidebarItems.forEach(i => i.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        
        // 渲染内容
        currentSection = section;
        renderSettingsContent(section);
      }
    });
  });
  
  // 初始化第一个侧边栏项为选中状态
  const firstItem = sidebarItems[0];
  if (firstItem) {
    firstItem.classList.add('active');
    currentSection = firstItem.getAttribute('data-section') || 'import-export';
  }
}

/**
 * 渲染设置内容
 * @param section 设置区域
 */
function renderSettingsContent(section: string): void {
  const contentContainer = document.querySelector(SETTINGS_MAIN);
  if (!contentContainer) return;
  
  // 清空内容
  contentContainer.innerHTML = '';
  
  // 根据选择的区域渲染不同内容
  switch (section) {
    case 'import-export':
      renderImportExportSettings(contentContainer);
      break;
    case 'search-engines':
      renderSearchEngineSettings(contentContainer);
      break;
    case 'languages':
      renderLanguageSettings(contentContainer);
      break;
    case 'background':
      renderBackgroundSettings(contentContainer);
      break;
    case 'display':
      renderDisplaySettings(contentContainer);
      break;
    case 'about':
      renderAboutSettings(contentContainer);
      break;
    default:
      contentContainer.innerHTML = '<div class="settings-section"><h3>设置不可用</h3></div>';
  }
}

/**
 * 渲染导入/导出设置
 * @param container 容器元素
 */
function renderImportExportSettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '导入/导出设置';
  section.appendChild(title);
  
  const description = document.createElement('p');
  description.textContent = '您可以导出当前配置为JSON文件，或导入之前保存的配置。';
  section.appendChild(description);
  
  // 导出按钮
  const exportButton = document.createElement('button');
  exportButton.className = 'btn primary-btn';
  exportButton.textContent = '导出配置';
  exportButton.addEventListener('click', exportConfig);
  section.appendChild(exportButton);
  
  // 导入按钮和文件选择器
  const importContainer = document.createElement('div');
  importContainer.className = 'import-container';
  
  const importLabel = document.createElement('label');
  importLabel.htmlFor = 'import-file';
  importLabel.className = 'btn secondary-btn';
  importLabel.textContent = '导入配置';
  
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'import-file';
  importInput.accept = '.json';
  importInput.style.display = 'none';
  importInput.addEventListener('change', importConfig);
  
  importContainer.appendChild(importLabel);
  importContainer.appendChild(importInput);
  section.appendChild(importContainer);
  
  // 重置按钮
  const resetButton = document.createElement('button');
  resetButton.className = 'btn danger-btn';
  resetButton.textContent = '重置为默认配置';
  resetButton.addEventListener('click', resetConfig);
  section.appendChild(resetButton);
  
  container.appendChild(section);
}

/**
 * 渲染搜索引擎设置
 * @param container 容器元素
 */
function renderSearchEngineSettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '搜索引擎管理';
  section.appendChild(title);
  
  // 搜索引擎列表
  const enginesList = document.createElement('div');
  enginesList.className = 'engines-list';
  
  const engines = dataManager.getSearchEngines();
  const defaultEngineId = dataManager.getDefaultEngine().id;
  const defaultLanguage = dataManager.getDefaultLanguage();
  
  engines.forEach(engine => {
    const engineItem = document.createElement('div');
    engineItem.className = 'engine-item';
    
    // 引擎图标
    const engineIcon = document.createElement('img');
    if (engine.iconImageData) {
      engineIcon.src = engine.iconImageData;
    } else if (engine.iconUrl) {
      engineIcon.src = engine.iconUrl;
    } else {
      engineIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTE4LjAzMSAxNi42MTdsNGE0LjQgMTAgMCAweC0xLjI5IDEuMjlsLTQuMDAxLTQuMDAxQTcgNyAwIDExMTggMTFhNyA3IDAgMDEtMS4xNiAzLjlsNC4wMDEgNC4wMDJhNC40IDEwIDAgMHgtMS4yOS0xLjI5bC00LTR2LjAwMnpNNyAxMmE1IDUgMCAxMDAgMCA1IDUgMCAwMDAgMHoiLz48L3N2Zz4=';
    }
    engineIcon.width = 24;
    engineIcon.height = 24;
    engineItem.appendChild(engineIcon);
    
    // 引擎名称
    const engineName = document.createElement('span');
    engineName.className = 'engine-name';
    engineName.textContent = engine.name[defaultLanguage] || Object.values(engine.name)[0];
    engineItem.appendChild(engineName);
    
    // 默认引擎选择
    const defaultCheckbox = document.createElement('input');
    defaultCheckbox.type = 'radio';
    defaultCheckbox.name = 'default-engine';
    defaultCheckbox.checked = engine.id === defaultEngineId;
    defaultCheckbox.addEventListener('change', () => {
      if (defaultCheckbox.checked) {
        dataManager.setDefaultEngine(engine.id);
      }
    });
    engineItem.appendChild(defaultCheckbox);
    
    // 删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '删除';
    deleteButton.addEventListener('click', () => {
      if (engine.id === defaultEngineId) {
        alert('不能删除默认搜索引擎');
        return;
      }
      
      if (confirm(`确定要删除搜索引擎 "${engineName.textContent}" 吗？`)) {
        dataManager.deleteSearchEngine(engine.id);
        renderSettingsContent('search-engines');
      }
    });
    engineItem.appendChild(deleteButton);
    
    // 编辑按钮
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = '编辑';
    editButton.addEventListener('click', () => {
      showEditEngineModal(engine.id);
    });
    engineItem.appendChild(editButton);
    
    enginesList.appendChild(engineItem);
  });
  
  section.appendChild(enginesList);
  
  // 添加新引擎按钮
  const addButton = document.createElement('button');
  addButton.className = 'btn primary-btn add-engine-btn';
  addButton.textContent = '添加新搜索引擎';
  addButton.addEventListener('click', () => {
    eventBus.publish('modal:show', 'engine-modal');
  });
  section.appendChild(addButton);
  
  container.appendChild(section);
}

/**
 * 渲染语言设置
 * @param container 容器元素
 */
function renderLanguageSettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '语言设置';
  section.appendChild(title);
  
  // 语言选择
  const languageSelector = document.createElement('div');
  languageSelector.className = 'language-selector';
  
  const languages = dataManager.getLanguages();
  const defaultLanguage = dataManager.getDefaultLanguage();
  
  Object.keys(languages).forEach(langCode => {
    const langItem = document.createElement('div');
    langItem.className = 'language-item';
    
    // 语言名称
    const langName = document.createElement('span');
    langName.className = 'language-name';
    langName.textContent = langCode === 'zh-CN' ? '中文' : 'English';
    langItem.appendChild(langName);
    
    // 选择按钮
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'default-language';
    radioButton.value = langCode;
    radioButton.checked = langCode === defaultLanguage;
    radioButton.addEventListener('change', () => {
      if (radioButton.checked) {
        dataManager.setDefaultLanguage(langCode);
      }
    });
    langItem.appendChild(radioButton);
    
    languageSelector.appendChild(langItem);
  });
  
  section.appendChild(languageSelector);
  container.appendChild(section);
}

/**
 * 渲染背景设置
 * @param container 容器元素
 */
function renderBackgroundSettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '背景设置';
  section.appendChild(title);
  
  const settings = settingsManager.getSettings();
  
  // 背景类型选择
  const backgroundTypes = [
    { value: 'bing', label: '必应每日壁纸' },
    { value: 'color', label: '纯色背景' },
    { value: 'custom', label: '自定义图片' }
  ];
  
  const typeSelector = document.createElement('div');
  typeSelector.className = 'background-type-selector';
  
  backgroundTypes.forEach(type => {
    const typeItem = document.createElement('div');
    typeItem.className = 'background-type-item';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'background-type';
    radio.value = type.value;
    radio.id = `bg-type-${type.value}`;
    radio.checked = settings.backgroundType === type.value;
    
    const label = document.createElement('label');
    label.htmlFor = `bg-type-${type.value}`;
    label.textContent = type.label;
    
    typeItem.appendChild(radio);
    typeItem.appendChild(label);
    
    radio.addEventListener('change', () => {
      if (radio.checked) {
        settingsManager.updateSettings({ backgroundType: radio.value as any });
        renderBackgroundSettings(container);
      }
    });
    
    typeSelector.appendChild(typeItem);
  });
  
  section.appendChild(typeSelector);
  
  // 根据选择的背景类型显示不同设置项
  if (settings.backgroundType === 'color') {
    // 颜色选择器
    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';
    
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'background-color';
    colorLabel.textContent = '背景颜色:';
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'background-color';
    colorInput.value = settings.backgroundColor;
    colorInput.addEventListener('change', () => {
      settingsManager.updateSettings({ backgroundColor: colorInput.value });
    });
    
    colorPicker.appendChild(colorLabel);
    colorPicker.appendChild(colorInput);
    section.appendChild(colorPicker);
  } else if (settings.backgroundType === 'custom') {
    // 自定义图片URL输入
    const customImageInput = document.createElement('div');
    customImageInput.className = 'custom-image-input';
    
    const imageLabel = document.createElement('label');
    imageLabel.htmlFor = 'background-image';
    imageLabel.textContent = '图片URL:';
    
    const imageInput = document.createElement('input');
    imageInput.type = 'text';
    imageInput.id = 'background-image';
    imageInput.value = settings.backgroundImage;
    imageInput.placeholder = '输入图片URL...';
    
    const saveButton = document.createElement('button');
    saveButton.className = 'btn secondary-btn';
    saveButton.textContent = '应用';
    saveButton.addEventListener('click', () => {
      settingsManager.updateSettings({ backgroundImage: imageInput.value });
    });
    
    customImageInput.appendChild(imageLabel);
    customImageInput.appendChild(imageInput);
    customImageInput.appendChild(saveButton);
    section.appendChild(customImageInput);
  }
  
  // 应用背景按钮
  const applyButton = document.createElement('button');
  applyButton.className = 'btn primary-btn';
  applyButton.textContent = '应用背景设置';
  applyButton.addEventListener('click', () => {
    settingsManager.applyBackground();
  });
  section.appendChild(applyButton);
  
  container.appendChild(section);
}

/**
 * 渲染显示设置
 * @param container 容器元素
 */
function renderDisplaySettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '显示设置';
  section.appendChild(title);
  
  const settings = settingsManager.getSettings();
  
  // 每行快捷方式数量
  const shortcutsPerRowContainer = document.createElement('div');
  shortcutsPerRowContainer.className = 'setting-item';
  
  const shortcutsPerRowLabel = document.createElement('label');
  shortcutsPerRowLabel.htmlFor = 'shortcuts-per-row';
  shortcutsPerRowLabel.textContent = '每行快捷方式数量:';
  
  const shortcutsPerRowInput = document.createElement('input');
  shortcutsPerRowInput.type = 'number';
  shortcutsPerRowInput.id = 'shortcuts-per-row';
  shortcutsPerRowInput.min = '3';
  shortcutsPerRowInput.max = '10';
  shortcutsPerRowInput.value = settings.shortcutsPerRow.toString();
  
  shortcutsPerRowContainer.appendChild(shortcutsPerRowLabel);
  shortcutsPerRowContainer.appendChild(shortcutsPerRowInput);
  section.appendChild(shortcutsPerRowContainer);
  
  // 显示网格线
  const showGridLinesContainer = document.createElement('div');
  showGridLinesContainer.className = 'setting-item';
  
  const showGridLinesLabel = document.createElement('label');
  showGridLinesLabel.htmlFor = 'show-grid-lines';
  showGridLinesLabel.textContent = '显示网格线:';
  
  const showGridLinesInput = document.createElement('input');
  showGridLinesInput.type = 'checkbox';
  showGridLinesInput.id = 'show-grid-lines';
  showGridLinesInput.checked = settings.showGridLines;
  
  showGridLinesContainer.appendChild(showGridLinesLabel);
  showGridLinesContainer.appendChild(showGridLinesInput);
  section.appendChild(showGridLinesContainer);
  
  // 搜索在新标签页打开
  const searchOpensInNewTabContainer = document.createElement('div');
  searchOpensInNewTabContainer.className = 'setting-item';
  
  const searchOpensInNewTabLabel = document.createElement('label');
  searchOpensInNewTabLabel.htmlFor = 'search-opens-in-new-tab';
  searchOpensInNewTabLabel.textContent = '搜索在新标签页打开:';
  
  const searchOpensInNewTabInput = document.createElement('input');
  searchOpensInNewTabInput.type = 'checkbox';
  searchOpensInNewTabInput.id = 'search-opens-in-new-tab';
  searchOpensInNewTabInput.checked = settings.searchOpensInNewTab;
  
  searchOpensInNewTabContainer.appendChild(searchOpensInNewTabLabel);
  searchOpensInNewTabContainer.appendChild(searchOpensInNewTabInput);
  section.appendChild(searchOpensInNewTabContainer);
  
  // 快捷方式在新标签页打开
  const shortcutOpensInNewTabContainer = document.createElement('div');
  shortcutOpensInNewTabContainer.className = 'setting-item';
  
  const shortcutOpensInNewTabLabel = document.createElement('label');
  shortcutOpensInNewTabLabel.htmlFor = 'shortcut-opens-in-new-tab';
  shortcutOpensInNewTabLabel.textContent = '快捷方式在新标签页打开:';
  
  const shortcutOpensInNewTabInput = document.createElement('input');
  shortcutOpensInNewTabInput.type = 'checkbox';
  shortcutOpensInNewTabInput.id = 'shortcut-opens-in-new-tab';
  shortcutOpensInNewTabInput.checked = settings.shortcutOpensInNewTab;
  
  shortcutOpensInNewTabContainer.appendChild(shortcutOpensInNewTabLabel);
  shortcutOpensInNewTabContainer.appendChild(shortcutOpensInNewTabInput);
  section.appendChild(shortcutOpensInNewTabContainer);
  
  // 保存按钮
  const saveButton = document.createElement('button');
  saveButton.className = 'btn primary-btn';
  saveButton.textContent = '保存设置';
  saveButton.addEventListener('click', () => {
    const newSettings = {
      shortcutsPerRow: parseInt(shortcutsPerRowInput.value, 10) || 5,
      showGridLines: showGridLinesInput.checked,
      searchOpensInNewTab: searchOpensInNewTabInput.checked,
      shortcutOpensInNewTab: shortcutOpensInNewTabInput.checked
    };
    
    settingsManager.updateSettings(newSettings);
    alert('设置已保存');
  });
  section.appendChild(saveButton);
  
  container.appendChild(section);
}

/**
 * 渲染关于信息
 * @param container 容器元素
 */
function renderAboutSettings(container: Element): void {
  const section = document.createElement('div');
  section.className = 'settings-section';
  
  const title = document.createElement('h3');
  title.textContent = '关于';
  section.appendChild(title);
  
  const aboutInfo = document.createElement('div');
  aboutInfo.className = 'about-info';
  
  const appName = document.createElement('h4');
  appName.textContent = 'Pistaink - 个性化导航平台';
  aboutInfo.appendChild(appName);
  
  const version = document.createElement('p');
  version.textContent = '版本: 0.1.0';
  aboutInfo.appendChild(version);
  
  const description = document.createElement('p');
  description.textContent = '这是一个完全可定制的导航网页首页工程，旨在提供便捷的网页快捷方式管理与搜索体验。';
  aboutInfo.appendChild(description);
  
  const copyright = document.createElement('p');
  copyright.textContent = '© 2023 Pistaink';
  aboutInfo.appendChild(copyright);
  
  section.appendChild(aboutInfo);
  container.appendChild(section);
}

/**
 * 导出配置
 */
function exportConfig(): void {
  try {
    // 获取数据
    const jsonData = dataManager.exportData();
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `pistaink_config_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error('导出配置失败:', error);
    alert('导出配置失败: ' + error);
  }
}

/**
 * 导入配置
 * @param event 文件选择事件
 */
function importConfig(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const jsonData = e.target?.result as string;
      dataManager.importData(jsonData);
      alert('配置导入成功');
      
      // 重新渲染设置
      renderSettingsContent(currentSection);
    } catch (error) {
      console.error('导入配置失败:', error);
      alert('导入配置失败: ' + error);
    }
  };
  
  reader.readAsText(file);
}

/**
 * 重置配置
 */
function resetConfig(): void {
  if (confirm('确定要重置为默认配置吗？这将清除所有自定义设置。')) {
    dataManager.resetToDefault()
      .then(() => {
        alert('已重置为默认配置');
        // 重新渲染设置
        renderSettingsContent(currentSection);
      })
      .catch(error => {
        console.error('重置配置失败:', error);
        alert('重置配置失败: ' + error);
      });
  }
}

/**
 * 显示编辑搜索引擎弹窗
 * @param engineId 搜索引擎ID
 */
function showEditEngineModal(engineId: string): void {
  // 获取搜索引擎数据
  const engine = dataManager.getSearchEngineById(engineId);
  if (!engine) return;
  
  // 设置引擎编辑弹窗的值
  const engineNameInput = document.querySelector('#engine-name') as HTMLInputElement;
  const engineNameEnInput = document.querySelector('#engine-name-en') as HTMLInputElement;
  const engineUrlInput = document.querySelector('#engine-url') as HTMLInputElement;
  const engineIconPreview = document.querySelector('#engine-icon-preview img') as HTMLImageElement;
  
  if (engineNameInput && engineNameEnInput && engineUrlInput && engineIconPreview) {
    engineNameInput.value = engine.name['zh-CN'] || '';
    engineNameEnInput.value = engine.name['en'] || '';
    engineUrlInput.value = engine.url;
    
    if (engine.iconImageData) {
      engineIconPreview.src = engine.iconImageData;
    } else if (engine.iconUrl) {
      engineIconPreview.src = engine.iconUrl;
    }
    
    // 更改按钮文本
    const saveButton = document.querySelector('#engine-save') as HTMLButtonElement;
    if (saveButton) {
      saveButton.textContent = '保存';
    }
    
    // 更改弹窗标题
    const modalTitle = document.querySelector('#engine-modal-title') as HTMLElement;
    if (modalTitle) {
      modalTitle.textContent = '编辑搜索引擎';
    }
    
    // 设置当前编辑的引擎ID
    (document.querySelector('#engine-modal') as HTMLElement).dataset.engineId = engineId;
  }
  
  // 显示弹窗
  eventBus.publish('modal:show', 'engine-modal');
} 