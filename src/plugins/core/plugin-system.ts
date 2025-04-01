import { App, Component } from 'vue';
import { IPlugin, IPluginState } from '@/types/plugin';

// 插件注册函数，用于开发插件
export function definePlugin(plugin: IPlugin): IPlugin {
	return plugin;
}

// 插件管理器类
class PluginManager {
	private plugins: Map<string, IPlugin> = new Map();
	private pluginStates: Map<string, IPluginState> = new Map();
	
	// 存储键名
	private STORAGE_KEY = 'pistaink_plugins';
	
	constructor() {
		this.loadPluginStates();
	}
	
	// 从本地存储加载插件状态
	private loadPluginStates(): void {
		try {
			const savedData = localStorage.getItem(this.STORAGE_KEY);
			if (savedData) {
				const states = JSON.parse(savedData) as IPluginState[];
				states.forEach(state => {
					this.pluginStates.set(state.id, state);
				});
			}
		} catch (error) {
			console.error('加载插件状态失败:', error);
		}
	}
	
	// 保存插件状态到本地存储
	private savePluginStates(): void {
		try {
			const states = Array.from(this.pluginStates.values());
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states));
		} catch (error) {
			console.error('保存插件状态失败:', error);
		}
	}
	
	// 注册插件
	registerPlugin(plugin: IPlugin): void {
		// 检查ID是否重复
		if (this.plugins.has(plugin.id)) {
			console.warn(`插件ID ${plugin.id} 已存在，无法重复注册`);
			return;
		}
		
		// 注册插件
		this.plugins.set(plugin.id, plugin);
		
		// 如果不存在状态，创建默认状态
		if (!this.pluginStates.has(plugin.id)) {
			this.pluginStates.set(plugin.id, {
				id: plugin.id,
				enabled: true,
				order: this.pluginStates.size // 默认顺序
			});
			this.savePluginStates();
		}
	}
	
	// 安装所有已启用的插件
	installPlugins(app: App): void {
		for (const plugin of this.plugins.values()) {
			const state = this.pluginStates.get(plugin.id);
			
			// 如果启用了插件，安装它
			if (state?.enabled && plugin.install) {
				plugin.install(app);
			}
		}
	}
	
	// 启用插件
	enablePlugin(id: string): void {
		const state = this.pluginStates.get(id);
		if (state) {
			state.enabled = true;
			this.savePluginStates();
			
			// 调用插件的激活钩子
			const plugin = this.plugins.get(id);
			if (plugin?.onActivate) {
				plugin.onActivate();
			}
		}
	}
	
	// 禁用插件
	disablePlugin(id: string): void {
		const state = this.pluginStates.get(id);
		if (state) {
			state.enabled = false;
			this.savePluginStates();
			
			// 调用插件的停用钩子
			const plugin = this.plugins.get(id);
			if (plugin?.onDeactivate) {
				plugin.onDeactivate();
			}
		}
	}
	
	// 获取所有插件
	getAllPlugins(): IPlugin[] {
		return Array.from(this.plugins.values());
	}
	
	// 获取已启用的插件
	getEnabledPlugins(): IPlugin[] {
		return this.getAllPlugins()
			.filter(plugin => {
				const state = this.pluginStates.get(plugin.id);
				return state && state.enabled;
			})
			.sort((a, b) => {
				const stateA = this.pluginStates.get(a.id);
				const stateB = this.pluginStates.get(b.id);
				return (stateA?.order || 0) - (stateB?.order || 0);
			});
	}
	
	// 获取插件状态
	getPluginState(id: string): IPluginState | undefined {
		return this.pluginStates.get(id);
	}
	
	// 更新插件顺序
	updatePluginOrder(id: string, order: number): void {
		const state = this.pluginStates.get(id);
		if (state) {
			state.order = order;
			this.savePluginStates();
		}
	}
}

// 导出单例实例
export const pluginManager = new PluginManager(); 