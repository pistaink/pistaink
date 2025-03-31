/**
 * 事件总线模块
 * 提供一个中心化的事件发布-订阅系统，解耦各个模块的直接依赖
 */

type EventCallback = (data?: any) => void;

class EventBus {
  private events: Record<string, EventCallback[]> = {};

  /**
   * 订阅事件
   * @param event 事件名称
   * @param callback 回调函数
   * @returns 取消订阅的函数
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // 返回取消订阅的函数
    return () => this.unsubscribe(event, callback);
  }

  /**
   * 发布事件
   * @param event 事件名称
   * @param data 事件数据
   */
  publish(event: string, data?: any): void {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  /**
   * 取消订阅
   * @param event 事件名称
   * @param callback 要取消的回调函数
   */
  unsubscribe(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * 清除某个事件的所有订阅
   * @param event 事件名称
   */
  clear(event: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// 导出单例
export default new EventBus(); 