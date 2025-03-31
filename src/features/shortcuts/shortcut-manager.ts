/**
 * 快捷方式管理器
 * 管理网站快捷方式的显示、添加、编辑和删除
 */

import dataManager from '../../core/data-manager';
import settingsManager from '../../core/settings-manager';
import eventBus from '../../core/event-bus';
import { Shortcut } from '../../core/data-manager';
import { iconFetcher, generateId } from '../../utils';

// DOM元素选择器
const SHORTCUTS_CONTAINER = '#shortcuts-container';
const SHORTCUT_MODAL = '#shortcut-modal';
const SHORTCUT_MODAL_TITLE = '#shortcut-modal-title';
const SHORTCUT_ICON_PREVIEW = '#shortcut-icon-preview';
const SHORTCUT_NAME = '#shortcut-name';
const SHORTCUT_NAME_EN = '#shortcut-name-en';
const SHORTCUT_URL = '#shortcut-url';
const SHORTCUT_SAVE = '#shortcut-save';
const SHORTCUT_CANCEL = '#shortcut-cancel';

// 当前编辑的快捷方式
let currentEditingId: string | null = null;

/**
 * 初始化快捷方式功能
 */
export function initShortcuts(): void {
  // 获取DOM元素
  const container = document.querySelector(SHORTCUTS_CONTAINER);
  if (!container) {
    console.error('无法找到快捷方式容器元素');
    return;
  }

  // 初始化快捷方式显示
  renderShortcuts();

  // 初始化弹窗事件
  initShortcutModal();

  // 监听快捷方式更新事件
  eventBus.subscribe('shortcuts:updated', renderShortcuts);

  // 监听应用重初始化事件
  eventBus.subscribe('app:reinitialized', renderShortcuts);
}

/**
 * 渲染快捷方式
 */
function renderShortcuts(): void {
  const container = document.querySelector(SHORTCUTS_CONTAINER);
  if (!container) return;

  // 获取快捷方式数据
  const shortcuts = dataManager.getShortcuts();
  const defaultLanguage = dataManager.getDefaultLanguage();

  // 清空容器
  container.innerHTML = '';

  // 添加快捷方式
  shortcuts.forEach(shortcut => {
    const shortcutElement = createShortcutElement(shortcut, defaultLanguage);
    container.appendChild(shortcutElement);
  });

  // 添加"添加快捷方式"按钮
  const addButton = document.createElement('div');
  addButton.className = 'shortcut add-shortcut';
  addButton.innerHTML = '<span class="add-icon">+</span>';
  addButton.addEventListener('click', showAddShortcutModal);
  container.appendChild(addButton);
}

/**
 * 创建快捷方式DOM元素
 * @param shortcut 快捷方式数据
 * @param language 当前语言
 * @returns 快捷方式DOM元素
 */
function createShortcutElement(shortcut: Shortcut, language: string): HTMLElement {
  const shortcutElement = document.createElement('div');
  shortcutElement.className = 'shortcut';
  shortcutElement.dataset.id = shortcut.id;

  // 创建图标容器
  const iconContainer = document.createElement('div');
  iconContainer.className = 'shortcut-icon';

  // 创建图标
  const icon = document.createElement('img');
  
  // 设置图标
  if (shortcut.iconImageData) {
    icon.src = shortcut.iconImageData;
  } else if (shortcut.iconUrl) {
    icon.src = shortcut.iconUrl;
  } else {
    // 异步加载图标
    icon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTIwIDQuOTRWMTBsLTIuMTEgMi4xMUw0IDI2LjIyVjIxLjA2TDE3Ljg5IDcuMTYgMjAgNC45NH0iTTIyIDIuNWwtMy41LTIuNUwxNyAxLjVsLTguNDggOC40OCA1LjUgNS40OUwyMiAyLjV6Ii8+PC9zdmc+';
    
    iconFetcher.fetchIcon(shortcut.url).then(iconUrl => {
      icon.src = iconUrl;
      // 更新快捷方式数据
      dataManager.updateShortcut(shortcut.id, { iconUrl });
    });
  }
  
  iconContainer.appendChild(icon);
  shortcutElement.appendChild(iconContainer);

  // 创建名称
  const name = document.createElement('div');
  name.className = 'shortcut-name';
  name.textContent = shortcut.name[language] || Object.values(shortcut.name)[0];
  shortcutElement.appendChild(name);

  // 创建编辑按钮
  const editButton = document.createElement('div');
  editButton.className = 'shortcut-edit';
  editButton.innerHTML = '⚙️';
  editButton.addEventListener('click', (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    showEditShortcutModal(shortcut.id);
  });
  shortcutElement.appendChild(editButton);

  // 绑定点击事件
  shortcutElement.addEventListener('click', () => {
    const settings = settingsManager.getSettings();
    window.open(ensureHttpProtocol(shortcut.url), settings.shortcutOpensInNewTab ? '_blank' : '_self');
  });

  return shortcutElement;
}

/**
 * 初始化快捷方式弹窗
 */
function initShortcutModal(): void {
  // 获取DOM元素
  const modal = document.querySelector(SHORTCUT_MODAL) as HTMLElement;
  const saveButton = document.querySelector(SHORTCUT_SAVE);
  const cancelButton = document.querySelector(SHORTCUT_CANCEL);
  
  if (!modal || !saveButton || !cancelButton) {
    console.error('无法找到快捷方式弹窗相关元素');
    return;
  }

  // 绑定保存按钮事件
  saveButton.addEventListener('click', saveShortcut);

  // 绑定取消按钮事件
  cancelButton.addEventListener('click', () => {
    modal.classList.remove('show');
    resetShortcutForm();
  });

  // 监听弹窗显示事件
  eventBus.subscribe('modal:show', (modalId: string) => {
    if (modalId === 'shortcut-modal') {
      modal.classList.add('show');
    }
  });

  // 监听弹窗隐藏事件
  eventBus.subscribe('modal:hide', (modalId: string) => {
    if (modalId === 'shortcut-modal') {
      modal.classList.remove('show');
      resetShortcutForm();
    }
  });

  // 点击弹窗背景关闭弹窗
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      resetShortcutForm();
    }
  });
}

/**
 * 显示添加快捷方式弹窗
 */
function showAddShortcutModal(): void {
  // 设置弹窗标题
  const modalTitle = document.querySelector(SHORTCUT_MODAL_TITLE);
  if (modalTitle) {
    modalTitle.textContent = '添加快捷方式';
  }

  // 重置当前编辑ID
  currentEditingId = null;

  // 显示弹窗
  eventBus.publish('modal:show', 'shortcut-modal');
}

/**
 * 显示编辑快捷方式弹窗
 * @param shortcutId 快捷方式ID
 */
function showEditShortcutModal(shortcutId: string): void {
  // 获取快捷方式数据
  const shortcut = dataManager.getShortcutById(shortcutId);
  if (!shortcut) {
    console.error('快捷方式不存在:', shortcutId);
    return;
  }

  // 设置弹窗标题
  const modalTitle = document.querySelector(SHORTCUT_MODAL_TITLE);
  if (modalTitle) {
    modalTitle.textContent = '编辑快捷方式';
  }

  // 填充表单
  const nameInput = document.querySelector(SHORTCUT_NAME) as HTMLInputElement;
  const nameEnInput = document.querySelector(SHORTCUT_NAME_EN) as HTMLInputElement;
  const urlInput = document.querySelector(SHORTCUT_URL) as HTMLInputElement;
  const iconPreview = document.querySelector(SHORTCUT_ICON_PREVIEW) as HTMLImageElement;

  if (nameInput && nameEnInput && urlInput && iconPreview) {
    // 填充名称
    nameInput.value = shortcut.name['zh-CN'] || '';
    nameEnInput.value = shortcut.name['en'] || '';
    
    // 填充URL
    urlInput.value = shortcut.url;
    
    // 填充图标预览
    if (shortcut.iconImageData) {
      iconPreview.src = shortcut.iconImageData;
    } else if (shortcut.iconUrl) {
      iconPreview.src = shortcut.iconUrl;
    } else {
      iconPreview.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTIwIDQuOTRWMTBsLTIuMTEgMi4xMUw0IDI2LjIyVjIxLjA2TDE3Ljg5IDcuMTYgMjAgNC45NH0iTTIyIDIuNWwtMy41LTIuNUwxNyAxLjVsLTguNDggOC40OCA1LjUgNS40OUwyMiAyLjV6Ii8+PC9zdmc+';
    }
  }

  // 设置当前编辑ID
  currentEditingId = shortcutId;

  // 显示弹窗
  eventBus.publish('modal:show', 'shortcut-modal');
}

/**
 * 保存快捷方式
 */
async function saveShortcut(): Promise<void> {
  // 获取表单数据
  const nameInput = document.querySelector(SHORTCUT_NAME) as HTMLInputElement;
  const nameEnInput = document.querySelector(SHORTCUT_NAME_EN) as HTMLInputElement;
  const urlInput = document.querySelector(SHORTCUT_URL) as HTMLInputElement;

  if (!nameInput || !nameEnInput || !urlInput) {
    console.error('无法获取表单数据');
    return;
  }

  const name = nameInput.value.trim();
  const nameEn = nameEnInput.value.trim();
  const url = urlInput.value.trim();

  // 验证表单
  if (!name || !url) {
    alert('请填写网站名称和网址');
    return;
  }

  try {
    // 准备快捷方式数据
    const shortcutData: Partial<Shortcut> = {
      name: {
        'zh-CN': name,
        'en': nameEn || name
      },
      url: ensureHttpProtocol(url)
    };

    // 获取图标
    try {
      const iconUrl = await iconFetcher.fetchIcon(shortcutData.url || '');
      if (iconUrl) {
        shortcutData.iconUrl = iconUrl;
      }
    } catch (iconError) {
      console.error('获取图标失败:', iconError);
      // 继续执行，使用默认图标
    }

    if (currentEditingId) {
      // 更新现有快捷方式
      dataManager.updateShortcut(currentEditingId, shortcutData);
    } else {
      // 添加新快捷方式
      const newShortcut: Shortcut = {
        id: generateId(),
        ...shortcutData as any
      };
      dataManager.addShortcut(newShortcut);
    }

    // 隐藏弹窗
    const modal = document.querySelector(SHORTCUT_MODAL) as HTMLElement;
    if (modal) {
      modal.classList.remove('show');
    }

    // 重置表单
    resetShortcutForm();
  } catch (error) {
    console.error('保存快捷方式失败:', error);
    alert('保存失败: ' + error);
  }
}

/**
 * 重置快捷方式表单
 */
function resetShortcutForm(): void {
  const nameInput = document.querySelector(SHORTCUT_NAME) as HTMLInputElement;
  const nameEnInput = document.querySelector(SHORTCUT_NAME_EN) as HTMLInputElement;
  const urlInput = document.querySelector(SHORTCUT_URL) as HTMLInputElement;
  const iconPreview = document.querySelector(SHORTCUT_ICON_PREVIEW) as HTMLImageElement;

  if (nameInput) nameInput.value = '';
  if (nameEnInput) nameEnInput.value = '';
  if (urlInput) urlInput.value = '';
  if (iconPreview) iconPreview.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTIwIDQuOTRWMTBsLTIuMTEgMi4xMUw0IDI2LjIyVjIxLjA2TDE3Ljg5IDcuMTYgMjAgNC45NH0iTTIyIDIuNWwtMy41LTIuNUwxNyAxLjVsLTguNDggOC40OCA1LjUgNS40OUwyMiAyLjV6Ii8+PC9zdmc+';

  // 重置当前编辑ID
  currentEditingId = null;
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