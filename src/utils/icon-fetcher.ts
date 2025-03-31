/**
 * 图标获取工具
 * 从目标网站自动获取favicon图标
 */

import storage from './storage';

// 图标缓存键前缀
const ICON_CACHE_PREFIX = 'icon_cache_';

// 默认图标
const DEFAULT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTEyIDJDNi40ODcgMiAyIDYuNDg3IDIgMTJzNC40ODcgMTAgMTAgMTAgMTAtNC40ODcgMTAtMTBTMTcuNTEzIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtNGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6bTAtNmE0IDQgMCAxIDAgMCA4IDQgNCAwIDAgMCAwLTh6IiBmaWxsPSIjODA4MDgwIi8+PC9zdmc+';

// 图标获取服务API
const FAVICON_API = 'https://favicon.yandex.net/favicon/';

/**
 * 从URL提取域名
 * @param url 网址
 * @returns 域名
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    // 如果URL无效，尝试使用正则表达式
    const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/i);
    return match ? match[1] : url;
  }
}

class IconFetcher {
  /**
   * 获取网站图标
   * @param url 网站URL
   * @returns Promise，解析为图标URL或数据URI
   */
  async fetchIcon(url: string): Promise<string> {
    // 提取域名
    const domain = extractDomain(url);
    
    // 尝试从缓存中获取
    const cachedIcon = storage.get<string>(`${ICON_CACHE_PREFIX}${domain}`);
    if (cachedIcon) {
      return cachedIcon;
    }
    
    try {
      // 使用favicon服务获取图标
      const iconUrl = `${FAVICON_API}${domain}`;
      
      // 检查图标是否可用
      const response = await fetch(iconUrl, { method: 'HEAD' });
      
      if (response.ok) {
        // 缓存并返回图标URL
        storage.set(`${ICON_CACHE_PREFIX}${domain}`, iconUrl);
        return iconUrl;
      }
      
      // 如果使用服务获取失败，则使用默认图标
      storage.set(`${ICON_CACHE_PREFIX}${domain}`, DEFAULT_ICON);
      return DEFAULT_ICON;
    } catch (error) {
      console.error('获取图标失败:', error);
      return DEFAULT_ICON;
    }
  }

  /**
   * 直接从网站获取favicon
   * 这个方法尝试直接从目标网站获取图标，可能会受到跨域限制
   * @param url 网站URL
   * @returns Promise，解析为图标URL
   */
  async fetchDirectFavicon(url: string): Promise<string> {
    const domain = extractDomain(url);
    const faviconUrl = `https://${domain}/favicon.ico`;
    
    try {
      const response = await fetch(faviconUrl, { method: 'HEAD' });
      if (response.ok) {
        return faviconUrl;
      }
      return this.fetchIcon(url);
    } catch (error) {
      return this.fetchIcon(url);
    }
  }

  /**
   * 清除图标缓存
   * @param domain 可选，特定域名。如果未提供，则清除所有图标缓存
   */
  clearCache(domain?: string): void {
    if (domain) {
      storage.remove(`${ICON_CACHE_PREFIX}${domain}`);
    } else {
      // 获取所有localStorage键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(ICON_CACHE_PREFIX)) {
          storage.remove(key);
        }
      }
    }
  }
}

// 导出单例
export default new IconFetcher(); 