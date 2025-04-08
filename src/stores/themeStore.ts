import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

// 通知类型
interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration: number
}

export const useThemeStore = defineStore('theme', () => {
  // 通知状态
  const notifications = reactive<Notification[]>([])
  
  // 显示通知
  function showNotification({ type, message, duration = 3000 }: { 
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration?: number
  }) {
    const id = Date.now().toString()
    
    // 添加新通知
    notifications.push({
      id,
      type,
      message,
      duration
    })
    
    // 设置自动清除
    setTimeout(() => {
      removeNotification(id)
    }, duration)
    
    return id
  }
  
  // 移除通知
  function removeNotification(id: string) {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }
  
  // 清除所有通知
  function clearAllNotifications() {
    notifications.splice(0, notifications.length)
  }
  
  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications
  }
}) 