/**
 * 存储工具
 * 提供localStorage的包装，增加了类型安全和错误处理
 */

class Storage {
  /**
   * 将数据存储到localStorage
   * @param key 存储键名
   * @param data 要存储的数据
   * @returns 成功返回true，失败返回false
   */
  set<T>(key: string, data: T): boolean {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`存储数据失败: ${key}`, error);
      return false;
    }
  }

  /**
   * 从localStorage获取数据
   * @param key 存储键名
   * @param defaultValue 默认值（如果没有找到数据）
   * @returns 存储的数据或默认值
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error(`获取数据失败: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * 从localStorage删除数据
   * @param key 存储键名
   * @returns 成功返回true，失败返回false
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除数据失败: ${key}`, error);
      return false;
    }
  }

  /**
   * 清除所有localStorage数据
   * @returns 成功返回true，失败返回false
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清除数据失败', error);
      return false;
    }
  }

  /**
   * 检查是否有特定键的数据存在
   * @param key 存储键名
   * @returns 如果数据存在返回true，否则返回false
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

// 导出单例
export default new Storage(); 