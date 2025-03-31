// 多语言字符串类型
export interface ILocalizedString {
	[lang: string]: string;
}

// 搜索引擎类型
export interface ISearchEngine {
	id: string;
	name: ILocalizedString;
	url: string;
	iconUrl?: string; // 图标URL，可选
	iconImageData?: string; // Base64格式的图标数据，可选
}

// 快捷方式类型
export interface IShortcut {
	id: string;
	name: ILocalizedString;
	url: string;
	iconUrl?: string; // 图标URL，可选
	iconImageData?: string; // Base64格式的图标数据，可选
}

// 背景设置类型
export interface IBackgroundSettings {
	type: 'color' | 'image' | 'bing'; // 背景类型：颜色、自定义图片、Bing每日图片
	color?: string; // 当type为color时的背景颜色
	imageUrl?: string; // 当type为image时的图片URL
	opacity?: number; // 背景不透明度，范围0-1
}

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto';

// 语言包类型
export interface ILanguagePack {
	[key: string]: string;
}

// 应用设置类型
export interface ISettings {
	themeMode: ThemeMode;
	backgroundSettings: IBackgroundSettings;
	language: string;
}

// 应用数据类型
export interface IAppData {
	engines: ISearchEngine[];
	shortcuts: IShortcut[];
	defaultEngine: string;
	defaultLanguage: string;
	languages: Record<string, ILanguagePack>;
}

// 插件接口
export interface IPlugin {
	id: string;
	name: string;
	description: string;
	icon: string;
	version: string;
	install?: (app: any) => void;
	onActivate?: () => void;
	onDeactivate?: () => void;
}

// 插件状态接口
export interface PluginState {
	enabled: boolean;
	position: number;
} 