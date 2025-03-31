/**
 * 搜索引擎管理模块
 * 管理搜索引擎的添加、编辑和删除
 */

import dataManager from '../../core/data-manager';
import eventBus from '../../core/event-bus';
import { SearchEngine } from '../../core/data-manager';
import { iconFetcher, generateId } from '../../utils';

// DOM元素选择器
const ENGINE_MODAL = '#engine-modal';
const ENGINE_MODAL_TITLE = '#engine-modal-title';
const ENGINE_ICON_PREVIEW = '#engine-icon-preview img';
const ENGINE_NAME = '#engine-name';
const ENGINE_NAME_EN = '#engine-name-en';
const ENGINE_URL = '#engine-url';
const ENGINE_SAVE = '#engine-save';
const ENGINE_CANCEL = '#engine-cancel';

/**
 * 初始化搜索引擎编辑功能
 */
export function initEngineManager(): void {
  // 获取DOM元素
  const modal = document.querySelector(ENGINE_MODAL) as HTMLElement;
  const saveButton = document.querySelector(ENGINE_SAVE);
  const cancelButton = document.querySelector(ENGINE_CANCEL);
  
  if (!modal || !saveButton || !cancelButton) {
    console.error('无法找到搜索引擎弹窗相关元素');
    return;
  }

  // 绑定保存按钮事件
  saveButton.addEventListener('click', saveEngine);

  // 绑定取消按钮事件
  cancelButton.addEventListener('click', () => {
    modal.classList.remove('show');
    resetEngineForm();
  });

  // 绑定URL输入框事件，自动获取图标
  const urlInput = document.querySelector(ENGINE_URL) as HTMLInputElement;
  if (urlInput) {
    urlInput.addEventListener('blur', async () => {
      const url = urlInput.value.trim();
      if (url) {
        try {
          const iconElement = document.querySelector(ENGINE_ICON_PREVIEW) as HTMLImageElement;
          if (iconElement) {
            const iconUrl = await iconFetcher.fetchIcon(url);
            iconElement.src = iconUrl;
          }
        } catch (error) {
          console.error('获取图标失败:', error);
        }
      }
    });
  }

  // 监听弹窗显示事件
  eventBus.subscribe('modal:show', (modalId: string) => {
    if (modalId === 'engine-modal') {
      // 检查是否是编辑模式
      if (!modal.dataset.engineId) {
        // 新增模式
        const modalTitle = document.querySelector(ENGINE_MODAL_TITLE);
        if (modalTitle) {
          modalTitle.textContent = '添加搜索引擎';
        }
        
        // 更改按钮文本
        const saveBtn = document.querySelector(ENGINE_SAVE) as HTMLButtonElement;
        if (saveBtn) {
          saveBtn.textContent = '添加';
        }
        
        resetEngineForm();
      }
      
      modal.classList.add('show');
    }
  });

  // 监听弹窗隐藏事件
  eventBus.subscribe('modal:hide', (modalId: string) => {
    if (modalId === 'engine-modal') {
      modal.classList.remove('show');
      resetEngineForm();
    }
  });

  // 点击弹窗背景关闭弹窗
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      resetEngineForm();
    }
  });
}

/**
 * 保存搜索引擎
 */
async function saveEngine(): Promise<void> {
  // 获取表单数据
  const nameInput = document.querySelector(ENGINE_NAME) as HTMLInputElement;
  const nameEnInput = document.querySelector(ENGINE_NAME_EN) as HTMLInputElement;
  const urlInput = document.querySelector(ENGINE_URL) as HTMLInputElement;
  const iconElement = document.querySelector(ENGINE_ICON_PREVIEW) as HTMLImageElement;
  const modal = document.querySelector(ENGINE_MODAL) as HTMLElement;

  if (!nameInput || !nameEnInput || !urlInput || !iconElement) {
    console.error('无法获取表单数据');
    return;
  }

  const name = nameInput.value.trim();
  const nameEn = nameEnInput.value.trim();
  const url = urlInput.value.trim();
  const iconUrl = iconElement.src;

  // 验证表单
  if (!name || !url) {
    alert('请填写引擎名称和搜索URL');
    return;
  }

  // 检查URL是否包含查询参数占位符
  if (!url.includes('{query}') && !url.includes('=')) {
    alert('搜索URL必须包含{query}占位符或至少一个查询参数');
    return;
  }

  try {
    // 准备搜索引擎数据
    const engineData: Partial<SearchEngine> = {
      name: {
        'zh-CN': name,
        'en': nameEn || name
      },
      url: url,
      iconUrl: iconUrl
    };

    const engineId = modal.dataset.engineId;
    
    if (engineId) {
      // 更新现有搜索引擎
      dataManager.updateSearchEngine(engineId, engineData);
    } else {
      // 添加新搜索引擎
      const newEngine: SearchEngine = {
        id: generateId(),
        ...engineData as any
      };
      dataManager.addSearchEngine(newEngine);
    }

    // 隐藏弹窗
    modal.classList.remove('show');
    
    // 重置表单和编辑状态
    resetEngineForm();
    delete modal.dataset.engineId;
  } catch (error) {
    console.error('保存搜索引擎失败:', error);
    alert('保存失败: ' + error);
  }
}

/**
 * 重置搜索引擎表单
 */
function resetEngineForm(): void {
  const nameInput = document.querySelector(ENGINE_NAME) as HTMLInputElement;
  const nameEnInput = document.querySelector(ENGINE_NAME_EN) as HTMLInputElement;
  const urlInput = document.querySelector(ENGINE_URL) as HTMLInputElement;
  const iconElement = document.querySelector(ENGINE_ICON_PREVIEW) as HTMLImageElement;
  const modal = document.querySelector(ENGINE_MODAL) as HTMLElement;

  if (nameInput) nameInput.value = '';
  if (nameEnInput) nameEnInput.value = '';
  if (urlInput) urlInput.value = '';
  if (iconElement) iconElement.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTE4LjAzMSAxNi42MTdsNGE0LjQgMTAgMCAweC0xLjI5IDEuMjlsLTQuMDAxLTQuMDAxQTcgNyAwIDExMTggMTFhNyA3IDAgMDEtMS4xNiAzLjlsNC4wMDEgNC4wMDJhNC40IDEwIDAgMHgtMS4yOS0xLjI5bC00LTR2LjAwMnpNNyAxMmE1IDUgMCAxMDAgMCA1IDUgMCAwMDAgMHoiLz48L3N2Zz4=';
  
  // 清除编辑ID
  if (modal) delete modal.dataset.engineId;
} 