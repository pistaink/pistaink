import { App } from 'vue';

// 插件定义接口
export interface IPlugin {
	// 基本信息
	id: string;
	name: string;
	description: string;
	icon: string;
	version: string;
	
	// 生命周期钩子
	install?: (app: App) => void;
	onActivate?: () => void;
	onDeactivate?: () => void;
	
	// 组件和配置
	component?: any;
	settings?: Record<string, any>;
}

// 插件状态类型
export interface IPluginState {
	id: string;
	enabled: boolean;
	order: number;
} 