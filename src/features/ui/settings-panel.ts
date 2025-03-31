/**
 * 设置面板管理模块
 * 管理设置面板的显示、隐藏和内容切换
 */

import eventBus from '../../core/event-bus';
import dataManager from '../../core/data-manager';
import settingsManager from '../../core/settings-manager';

// DOM元素选择器
const SETTINGS_PANEL = '#settings-panel';
const SETTINGS_SIDEBAR = '.settings-sidebar ul';
const SETTINGS_MAIN = '.settings-main';
const BACK_BUTTON = '.back-button';
const DONE_BUTTON = '.done-button';

/**
 * 初始化设置面板
 */
export function initSettingsPanel(): void {
  // 获取DOM元素
  const panel = document.querySelector(SETTINGS_PANEL) as HTMLElement;
  const sidebar = document.querySelector(SETTINGS_SIDEBAR);
  const mainContent = document.querySelector(SETTINGS_MAIN);
  const backButton = document.querySelector(BACK_BUTTON);
  const doneButton = document.querySelector(DONE_BUTTON);

  if (!panel || !sidebar || !mainContent || !backButton || !doneButton) {
    console.error('无法找到设置面板相关元素');
    return;
  }

  // 绑定返回按钮事件
  backButton.addEventListener('click', () => {
    panel.classList.remove('show');
  });

  // 绑定完成按钮事件
  doneButton.addEventListener('click', () => {
    panel.classList.remove('show');
  });

  // 绑定侧边栏点击事件
  sidebar.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const section = target.closest('li');
    if (section) {
      const sectionId = section.dataset.section;
      if (sectionId) {
        // 移除其他选项的active类
        sidebar.querySelectorAll('li').forEach(item => {
          item.classList.remove('active');
        });
        // 添加当前选项的active类
        section.classList.add('active');
        // 加载对应的设置内容
        loadSettingsContent(sectionId);
      }
    }
  });

  // 监听设置按钮点击事件
  document.querySelector('.settings-button')?.addEventListener('click', () => {
    panel.classList.add('show');
    // 默认选中第一个选项
    const firstSection = sidebar.querySelector('li');
    if (firstSection) {
      firstSection.classList.add('active');
      loadSettingsContent(firstSection.dataset.section || 'import-export');
    }
  });
}

/**
 * 加载设置内容
 */
function loadSettingsContent(sectionId: string): void {
  const mainContent = document.querySelector(SETTINGS_MAIN);
  if (!mainContent) return;

  // 清空现有内容
  mainContent.innerHTML = '';

  switch (sectionId) {
    case 'import-export':
      loadImportExportContent(mainContent);
      break;
    case 'search-engines':
      loadSearchEnginesContent(mainContent);
      break;
    case 'languages':
      loadLanguagesContent(mainContent);
      break;
    case 'background':
      loadBackgroundContent(mainContent);
      break;
    case 'display':
      loadDisplayContent(mainContent);
      break;
    case 'about':
      loadAboutContent(mainContent);
      break;
  }
}

/**
 * 加载导入/导出设置内容
 */
function loadImportExportContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <h3 data-i18n="import_export">导入/导出</h3>
    <div class="import-container">
      <button class="btn primary-btn" id="export-settings" data-i18n="export_settings">导出设置</button>
      <button class="btn secondary-btn" id="import-settings" data-i18n="import_settings">导入设置</button>
    </div>
  `;

  container.appendChild(content);

  // 绑定导出按钮事件
  content.querySelector('#export-settings')?.addEventListener('click', () => {
    const settings = dataManager.exportSettings();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pistaink-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 绑定导入按钮事件
  content.querySelector('#import-settings')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            dataManager.importSettings(settings);
            eventBus.publish('data:imported');
            alert('设置导入成功');
          } catch (error) {
            console.error('导入设置失败:', error);
            alert('导入失败: 无效的设置文件');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });
}

/**
 * 加载搜索引擎设置内容
 */
function loadSearchEnginesContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <h3 data-i18n="search_engines">搜索引擎</h3>
    <div class="engines-list"></div>
    <button class="btn primary-btn" id="add-engine" data-i18n="add_new_engine">添加搜索引擎</button>
  `;

  container.appendChild(content);

  // 渲染搜索引擎列表
  const enginesList = content.querySelector('.engines-list');
  if (enginesList) {
    renderSearchEngines(enginesList);
  }

  // 绑定添加按钮事件
  content.querySelector('#add-engine')?.addEventListener('click', () => {
    eventBus.publish('modal:show', 'engine-modal');
  });
}

/**
 * 渲染搜索引擎列表
 */
function renderSearchEngines(container: Element): void {
  const engines = dataManager.getSearchEngines();
  container.innerHTML = engines.map(engine => `
    <div class="engine-item" data-engine-id="${engine.id}">
      <img src="${engine.iconUrl}" alt="${engine.name['zh-CN']}">
      <span class="engine-name">${engine.name['zh-CN']}</span>
      <input type="radio" name="default-engine" value="${engine.id}" 
        ${engine.id === dataManager.getDefaultEngine() ? 'checked' : ''}>
      <button class="edit-btn" data-i18n="edit">编辑</button>
      <button class="delete-btn" data-i18n="delete">删除</button>
    </div>
  `).join('');

  // 绑定编辑按钮事件
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const engineItem = (e.target as HTMLElement).closest('.engine-item') as HTMLElement;
      if (engineItem) {
        const engineId = engineItem.dataset.engineId;
        if (engineId) {
          const engine = dataManager.getSearchEngine(engineId);
          if (engine) {
            // 填充表单
            const modal = document.querySelector('#engine-modal') as HTMLElement;
            if (modal) {
              modal.dataset.engineId = engineId;
              const nameInput = document.querySelector('#engine-name') as HTMLInputElement;
              const nameEnInput = document.querySelector('#engine-name-en') as HTMLInputElement;
              const urlInput = document.querySelector('#engine-url') as HTMLInputElement;
              const iconElement = document.querySelector('#engine-icon-preview img') as HTMLImageElement;

              if (nameInput) nameInput.value = engine.name['zh-CN'];
              if (nameEnInput) nameEnInput.value = engine.name['en'];
              if (urlInput) urlInput.value = engine.url;
              if (iconElement) iconElement.src = engine.iconUrl;

              // 更改按钮文本
              const saveBtn = document.querySelector('#engine-save') as HTMLButtonElement;
              if (saveBtn) {
                saveBtn.textContent = '保存';
              }

              eventBus.publish('modal:show', 'engine-modal');
            }
          }
        }
      }
    });
  });

  // 绑定删除按钮事件
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const engineItem = (e.target as HTMLElement).closest('.engine-item') as HTMLElement;
      if (engineItem) {
        const engineId = engineItem.dataset.engineId;
        if (engineId && confirm('确定要删除这个搜索引擎吗？')) {
          dataManager.deleteSearchEngine(engineId);
          renderSearchEngines(container);
        }
      }
    });
  });

  // 绑定默认引擎选择事件
  container.querySelectorAll('input[name="default-engine"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const engineId = (e.target as HTMLInputElement).value;
      dataManager.setDefaultEngine(engineId);
    });
  });
}

/**
 * 加载语言设置内容
 */
function loadLanguagesContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <h3 data-i18n="language_settings">语言设置</h3>
    <div class="language-selector"></div>
  `;

  container.appendChild(content);

  // 渲染语言选择器
  const languageSelector = content.querySelector('.language-selector');
  if (languageSelector) {
    renderLanguageSelector(languageSelector);
  }
}

/**
 * 渲染语言选择器
 */
function renderLanguageSelector(container: Element): void {
  const languages = dataManager.getLanguages();
  const currentLanguage = dataManager.getDefaultLanguage();

  container.innerHTML = languages.map(lang => `
    <div class="language-item" data-language="${lang}">
      <span>${lang === 'zh-CN' ? '中文' : 'English'}</span>
      <input type="radio" name="language" value="${lang}" 
        ${lang === currentLanguage ? 'checked' : ''}>
    </div>
  `).join('');

  // 绑定语言选择事件
  container.querySelectorAll('input[name="language"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const language = (e.target as HTMLInputElement).value;
      dataManager.setDefaultLanguage(language);
      eventBus.publish('language:changed', language);
    });
  });
}

/**
 * 加载背景设置内容
 */
function loadBackgroundContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <h3 data-i18n="background_settings">背景设置</h3>
    <div class="background-type-selector"></div>
    <div class="color-picker">
      <label data-i18n="background_color">背景颜色</label>
      <input type="color" id="background-color" value="#ffffff">
    </div>
    <div class="custom-image-input">
      <label data-i18n="custom_background">自定义背景</label>
      <input type="text" id="custom-background" placeholder="输入图片URL">
      <button class="btn primary-btn" id="apply-background" data-i18n="apply">应用</button>
    </div>
  `;

  container.appendChild(content);

  // 渲染背景类型选择器
  const backgroundSelector = content.querySelector('.background-type-selector');
  if (backgroundSelector) {
    renderBackgroundSelector(backgroundSelector);
  }

  // 绑定颜色选择器事件
  const colorPicker = content.querySelector('#background-color') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.value = settingsManager.getBackgroundColor();
    colorPicker.addEventListener('change', (e) => {
      const color = (e.target as HTMLInputElement).value;
      settingsManager.setBackgroundColor(color);
      document.body.style.backgroundColor = color;
    });
  }

  // 绑定自定义背景输入框事件
  const customBackground = content.querySelector('#custom-background') as HTMLInputElement;
  if (customBackground) {
    customBackground.value = settingsManager.getCustomBackground() || '';
    customBackground.addEventListener('change', (e) => {
      const url = (e.target as HTMLInputElement).value;
      settingsManager.setCustomBackground(url);
      if (url) {
        document.body.style.backgroundImage = `url(${url})`;
      } else {
        document.body.style.backgroundImage = '';
      }
    });
  }

  // 绑定应用按钮事件
  content.querySelector('#apply-background')?.addEventListener('click', () => {
    const url = customBackground.value;
    if (url) {
      settingsManager.setCustomBackground(url);
      document.body.style.backgroundImage = `url(${url})`;
    }
  });
}

/**
 * 渲染背景类型选择器
 */
function renderBackgroundSelector(container: Element): void {
  const types = [
    { id: 'color', name: '纯色背景' },
    { id: 'custom', name: '自定义背景' },
    { id: 'bing', name: 'Bing每日壁纸' }
  ];

  container.innerHTML = types.map(type => `
    <div class="background-type-item" data-type="${type.id}">
      <span>${type.name}</span>
      <input type="radio" name="background-type" value="${type.id}">
    </div>
  `).join('');

  // 绑定背景类型选择事件
  container.querySelectorAll('input[name="background-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value;
      settingsManager.setBackgroundType(type);
      // 根据类型显示/隐藏相关设置
      const colorPicker = document.querySelector('.color-picker') as HTMLElement;
      const customImageInput = document.querySelector('.custom-image-input') as HTMLElement;
      if (colorPicker) colorPicker.style.display = type === 'color' ? 'flex' : 'none';
      if (customImageInput) customImageInput.style.display = type === 'custom' ? 'flex' : 'none';
    });
  });

  // 设置当前选中的类型
  const currentType = settingsManager.getBackgroundType();
  const currentRadio = container.querySelector(`input[value="${currentType}"]`) as HTMLInputElement;
  if (currentRadio) {
    currentRadio.checked = true;
    // 触发change事件以更新UI
    currentRadio.dispatchEvent(new Event('change'));
  }
}

/**
 * 加载显示设置内容
 */
function loadDisplayContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <h3 data-i18n="display_settings">显示设置</h3>
    <div class="setting-item">
      <span data-i18n="show_icons">显示图标</span>
      <input type="checkbox" id="show-icons" ${settingsManager.getShowIcons() ? 'checked' : ''}>
    </div>
    <div class="setting-item">
      <span data-i18n="show_names">显示名称</span>
      <input type="checkbox" id="show-names" ${settingsManager.getShowNames() ? 'checked' : ''}>
    </div>
  `;

  container.appendChild(content);

  // 绑定复选框事件
  content.querySelector('#show-icons')?.addEventListener('change', (e) => {
    const show = (e.target as HTMLInputElement).checked;
    settingsManager.setShowIcons(show);
    eventBus.publish('display:changed');
  });

  content.querySelector('#show-names')?.addEventListener('change', (e) => {
    const show = (e.target as HTMLInputElement).checked;
    settingsManager.setShowNames(show);
    eventBus.publish('display:changed');
  });
}

/**
 * 加载关于内容
 */
function loadAboutContent(container: Element): void {
  const content = document.createElement('div');
  content.className = 'settings-section';

  content.innerHTML = `
    <div class="about-info">
      <h4 data-i18n="about_title">关于 Pistaink</h4>
      <p data-i18n="about_version">版本: 0.1.0</p>
      <p data-i18n="about_description">
        Pistaink 是一个个性化的导航平台，帮助您更好地管理和访问常用网站。
      </p>
      <p data-i18n="about_github">
        <a href="https://github.com/yourusername/pistaink" target="_blank">GitHub 仓库</a>
      </p>
    </div>
  `;

  container.appendChild(content);
} 