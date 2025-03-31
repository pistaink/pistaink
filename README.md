# pistaink.com 
这是一个部署在GitHub Page上的静态网站工程，主要提供个性化导航功能。

## 界面布局
1. 主界面
2. 设置界面
3. 快捷方式添加弹窗
4. 搜索引擎添加弹窗
5. 绘画板功能区

## 功能说明
1. 这是一个导航网页首页工程，目标是方便管理网页快捷方式。
2. 界面上的所有配置，都能配置在一个JSON数据文件中，能导入配置实现设置。修改配置，也会修改JSON文件。
3. 界面最上面是工具栏，靠右自然排序功能有：语言切换（切换语言），设置按钮。设置按钮点击，打开首页设置面板，设置面板显示全屏挡住首页。
4. 设置面板，左侧是纵向的功能选项列表，右侧则是具体的功能面板。需要如下功能：
	- 导入：导入JSON格式的首页配置，如同 /static/default.json 的结构
	- 导出：导出JSON格式的首页配置
	- 搜索引擎：功能面板中，左侧是各种搜索引擎选项列表（增删改查），右侧上面id表示，以及url, 下面是名称的各种语言翻译的列表，可以增删改查
   - 语言添加：功能面板是一个表格，横向是罗列所有的界面中用到的key，纵向是不同语言下 key对应的翻译。表格出来一行，第一列固定外，可以左右上下滑动。第一行可以添加新key,删除旧key。第一列也可以添加新的语言，删除旧语言
5. 中间上面，是如同 www.bing.com 首页的的搜索框，搜索框左边是搜索引擎切换按钮（显示搜索引擎icon），搜索框右侧是搜索按钮。搜索引擎切换按钮，点击触发下拉菜单，下拉菜单采用grid排列，3个一行，从左往右，从上往下自动排列，下拉菜单末尾自动添加 【添加搜索引擎】，点击打开【搜索引擎添加弹窗】。
6. 搜索引擎添加弹窗：是一个类似于设置面板中的搜索引擎添加，是简单版本的，只需要包含url，以及默认名称。
7. 中下部是快捷方式排列面板。排列面板中采用Grid排列网页快捷方式，排列顺序是，从左往右，从上往下。整个快捷方式排列面板是可以上下滑动的。
8. 快捷方式：显示大小 80x80 px, 中上部是 icon, 下方是缩略名字。右上角是3个点的编辑按钮。编辑按钮点击，弹出快捷方式编辑弹窗。
9. 快捷方式弹窗：最上面是icon，中间是网页快捷方式名称的编辑。下面是网页快捷方式URL的编辑。
10. 背景：需要每天从Bing首页自动获取首页照片URL，然后自动设置成当前页的首页背景。
11. 添加网页快捷方式，以及搜索引擎，我们这里并不会上传icon，这里需要设计一个爬取icon工具，自动从对应网站自动爬取，然后自动存储到网页的localStorage中。
12. 添加GitHub工作流，每次提交后，自动部署GitHub Page静态网页。
13. 绘画板功能：提供简易绘画工具，支持以下功能：
    - 使用画笔工具进行自由绘画
    - 橡皮擦工具擦除内容
    - 多种颜色选择
    - 画笔粗细调整
    - 更换画布背景颜色
    - 清除画布
    - 保存绘画为PNG图片

## 技术栈
- **TypeScript** - 静态类型检查
- **Vue3** - 组件化开发框架
- **Vite4** - 现代化构建工具

## 插件系统
本项目实现了灵活的插件系统，允许添加第三方功能而无需修改核心代码：

1. **插件接口**: 统一的插件标准，支持生命周期钩子
2. **动态加载**: 按需加载插件，提高性能
3. **工具栏集成**: 插件按钮自动在工具栏左侧排列
4. **插件商店**: 支持在线浏览和安装插件

默认包含的插件:
- **网页截图**: 截取当前网页并保存
- **颜色提取器**: 从网页中提取主要颜色
- **备忘录**: 简单的笔记功能
- **天气预报**: 显示当前位置天气

### 插件开发示例
```typescript
// 插件开发示例
import { definePlugin } from '@/plugins/plugin-system';

export default definePlugin({
	id: 'color-picker',
	name: '颜色提取器',
	description: '从网页中提取主要颜色',
	icon: 'color-palette',
	version: '1.0.0',
	
	// 安装时调用
	install(app) {
		// 初始化插件资源
	},
	
	// 点击插件图标时执行
	onActivate() {
		// 打开颜色提取器
	},
	
	// 插件被禁用时清理
	onDeactivate() {
		// 清理资源
	}
});
```

## 基本规则
1. Tab缩进，Tab长度为4个空格长度
2. 遵循ESLint和Prettier配置的代码风格
3. 每个文件不超过500行，超过则拆分功能
4. 使用ES6+模块和类
5. 文件名、类名使用PascalCase，函数和变量使用camelCase
6. 常量使用UPPER_SNAKE_CASE
7. 接口名称前加"I"前缀（如IPlugin）
8. 私有属性和方法使用下划线前缀（如_privateMethod）
9. 添加全局错误捕获和日志系统
10. 使用虚拟列表渲染大量快捷方式
11. 控制台操作，使用Windows兼容的命令
12. Vue组件使用组合式API (Composition API)
13. 使用Pinia进行状态管理
14. 关注点分离：每个模块专注于特定功能，提高代码的可维护性
15. 错误处理和日志：添加全面的错误捕获和日志记录
16. 代码组织：文件结构符合前端工程化最佳实践

## 目录结构

```
├── public/             # 静态资源目录
│   ├── static/             # 静态数据文件
│   │   └── default.json        # 默认配置数据
│   ├── favicon.ico         # 网站图标
│   └── robots.txt          # 爬虫配置
│
├── src/                # 源代码目录
│   ├── assets/             # 资源文件
│   │   ├── images/             # 图片资源
│   │   └── styles/             # 全局样式
│   │       ├── variables.scss      # 样式变量
│   │       └── global.scss          # 全局样式
│   │
│   ├── components/         # 通用组件
│   │   ├── common/             # 通用UI组件
│   │   │   ├── Modal.vue           # 通用模态框
│   │   │   ├── Button.vue          # 按钮组件
│   │   │   └── Icon.vue            # 图标组件
│   │   │
│   │   ├── layout/             # 布局组件
│   │   │   ├── Header.vue          # 顶部栏
│   │   │   └── Footer.vue          # 底部栏
│   │   │
│   │   ├── search/             # 搜索相关组件
│   │   │   ├── SearchBox.vue       # 搜索框
│   │   │   ├── EngineSelector.vue  # 搜索引擎选择器
│   │   │   └── EngineModal.vue     # 引擎添加/编辑模态框
│   │   │
│   │   ├── shortcuts/          # 快捷方式组件
│   │   │   ├── ShortcutGrid.vue    # 快捷方式网格
│   │   │   ├── ShortcutItem.vue    # 单个快捷方式项
│   │   │   └── ShortcutModal.vue   # 快捷方式编辑模态框
│   │   │
│   │   └── settings/           # 设置面板组件
│   │       ├── SettingsPanel.vue   # 设置面板
│   │       ├── ImportExport.vue    # 导入导出设置
│   │       ├── EngineSettings.vue  # 搜索引擎设置
│   │       ├── LanguageSettings.vue# 语言设置
│   │       └── BackgroundSettings.vue # 背景设置
│   │
│   ├── composables/        # 组合式函数
│   │   ├── useLocalStorage.ts  # 本地存储Hook
│   │   ├── useTheme.ts         # 主题Hook
│   │   ├── useBackground.ts    # 背景设置Hook
│   │   └── useIconFetcher.ts   # 图标获取Hook
│   │
│   ├── stores/             # Pinia状态管理
│   │   ├── dataStore.ts        # 数据状态存储
│   │   ├── settingsStore.ts    # 设置状态存储
│   │   ├── searchStore.ts      # 搜索相关状态
│   │   └── i18nStore.ts        # 国际化状态
│   │
│   ├── services/           # 服务层
│   │   ├── apiService.ts       # API服务
│   │   ├── iconService.ts      # 图标获取服务
│   │   ├── bingService.ts      # Bing背景服务
│   │   └── storageService.ts   # 存储服务
│   │
│   ├── utils/              # 工具函数
│   │   ├── helpers.ts          # 通用辅助函数
│   │   ├── validators.ts       # 数据验证函数
│   │   ├── formatters.ts       # 格式化函数
│   │   └── eventBus.ts         # 事件总线
│   │
│   ├── types/              # TypeScript类型定义
│   │   ├── models.ts           # 数据模型类型
│   │   ├── settings.ts         # 设置类型
│   │   ├── search.ts           # 搜索相关类型
│   │   └── i18n.ts             # 国际化类型
│   │
│   ├── i18n/               # 国际化资源
│   │   ├── index.ts            # i18n配置
│   │   ├── zh-CN.ts            # 中文语言包
│   │   └── en.ts               # 英文语言包
│   │
│   ├── router/             # Vue Router
│   │   └── index.ts            # 路由配置
│   │
│   ├── App.vue             # 根组件
│   ├── main.ts             # 应用入口
│   └── env.d.ts            # 环境变量类型声明
│
├── .github/             # GitHub配置
│   └── workflows/          # GitHub Actions工作流
│       └── deploy.yml          # 自动部署配置
│
├── .vscode/             # VSCode配置
│   ├── settings.json        # 编辑器设置
│   └── extensions.json      # 推荐扩展
│
├── vite.config.ts       # Vite配置
├── tsconfig.json        # TypeScript配置
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 模块化设计

### 1. 状态管理 (Pinia)

使用Pinia进行状态管理，将不同功能的状态拆分为独立的store：

```typescript
// src/stores/dataStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ISearchEngine, IShortcut } from '@/types/models';
import { storageService } from '@/services/storageService';

export const useDataStore = defineStore('data', () => {
	// 状态定义
	const engines = ref<ISearchEngine[]>([]);
	const shortcuts = ref<IShortcut[]>([]);
	const defaultEngine = ref<string>('');
	
	// Getters
	const getEngineById = computed(() => (id: string) => 
		engines.value.find(engine => engine.id === id)
	);
	
	// Actions
	function loadData() {
		const data = storageService.getData();
		if (data) {
			engines.value = data.engines;
			shortcuts.value = data.shortcuts;
			defaultEngine.value = data.defaultEngine;
		}
	}
	
	function saveData() {
		storageService.saveData({
			engines: engines.value,
			shortcuts: shortcuts.value,
			defaultEngine: defaultEngine.value
		});
	}
	
	return {
		engines,
		shortcuts,
		defaultEngine,
		getEngineById,
		loadData,
		saveData
	};
});
```

### 2. 组合式函数 (Composables)

将可复用的逻辑封装为组合式函数：

```typescript
// src/composables/useBackground.ts
import { ref, watch } from 'vue';
import { bingService } from '@/services/bingService';
import { useSettingsStore } from '@/stores/settingsStore';

export function useBackground() {
	const settingsStore = useSettingsStore();
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	
	// 应用背景
	async function applyBackground() {
		const { backgroundType, backgroundColor, backgroundImage } = settingsStore.backgroundSettings;
		
		if (backgroundType === 'color') {
			document.body.style.backgroundImage = 'none';
			document.body.style.backgroundColor = backgroundColor;
		} else if (backgroundType === 'custom' && backgroundImage) {
			document.body.style.backgroundImage = `url(${backgroundImage})`;
		} else if (backgroundType === 'bing') {
			try {
				isLoading.value = true;
				error.value = null;
				const imageUrl = await bingService.getDailyImage();
				document.body.style.backgroundImage = `url(${imageUrl})`;
			} catch (err) {
				error.value = '获取必应图片失败';
				console.error(err);
				// 失败时使用默认颜色
				document.body.style.backgroundImage = 'none';
				document.body.style.backgroundColor = '#ffffff';
			} finally {
				isLoading.value = false;
			}
		}
	}
	
	// 监听背景设置变化
	watch(
		() => settingsStore.backgroundSettings,
		() => applyBackground(),
		{ deep: true }
	);
	
	return {
		isLoading,
		error,
		applyBackground
	};
}
```

### 3. 服务层 (Services)

封装独立的功能服务：

```typescript
// src/services/iconService.ts
import { ref } from 'vue';
import { storageService } from './storageService';

const ICON_STORAGE_KEY = 'pistaink_icons';
const DEFAULT_ICON = 'data:image/svg+xml;base64,...'; // 默认图标Base64

class IconService {
	private iconCache: Record<string, string> = {};
	
	constructor() {
		this.loadIconCache();
	}
	
	private loadIconCache() {
		const cachedIcons = storageService.getItem<Record<string, string>>(ICON_STORAGE_KEY);
		if (cachedIcons) {
			this.iconCache = cachedIcons;
		}
	}
	
	private saveIconCache() {
		storageService.setItem(ICON_STORAGE_KEY, this.iconCache);
	}
	
	async fetchIcon(url: string): Promise<string> {
		// 规范化URL
		const domain = new URL(url).hostname;
		
		// 检查缓存
		if (this.iconCache[domain]) {
			return this.iconCache[domain];
		}
		
		try {
			// 尝试获取favicon
			const faviconUrl = `https://${domain}/favicon.ico`;
			const googleIconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
			
			// 使用Google的favicon服务作为备选
			const iconUrl = googleIconUrl;
			
			// 缓存图标URL
			this.iconCache[domain] = iconUrl;
			this.saveIconCache();
			
			return iconUrl;
		} catch (error) {
			console.error('获取图标失败:', error);
			return DEFAULT_ICON;
		}
	}
	
	getIcon(url: string): string {
		const domain = new URL(url).hostname;
		return this.iconCache[domain] || DEFAULT_ICON;
	}
}

export const iconService = new IconService();
```

## 通信机制

### 1. 组件间通信

Vue3 组件间通信主要通过以下方式：

1. **Props/Events**: 父子组件通信
2. **Provide/Inject**: 跨层级组件通信
3. **Pinia**: 全局状态共享

### 2. 事件总线 (仅用于非Vue组件间通信)

```typescript
// src/utils/eventBus.ts
type EventCallback = (...args: any[]) => void;

class EventBus {
	private events = new Map<string, EventCallback[]>();
	
	on(event: string, callback: EventCallback) {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		
		this.events.get(event)!.push(callback);
		
		// 返回取消订阅的函数
		return () => this.off(event, callback);
	}
	
	off(event: string, callback: EventCallback) {
		if (!this.events.has(event)) return;
		
		const callbacks = this.events.get(event)!;
		const index = callbacks.indexOf(callback);
		
		if (index !== -1) {
			callbacks.splice(index, 1);
		}
		
		if (callbacks.length === 0) {
			this.events.delete(event);
		}
	}
	
	emit(event: string, ...args: any[]) {
		if (!this.events.has(event)) return;
		
		this.events.get(event)!.forEach(callback => {
			callback(...args);
		});
	}
	
	clear() {
		this.events.clear();
	}
}

// 导出单例
export const eventBus = new EventBus();
```

## 安装与运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check
```

### 构建部署

```bash
# 安装gh-pages包
npm install --save-dev gh-pages

# 构建生产版本
npm run build

# 部署到GitHub Pages
npm run deploy
```

在package.json中添加:
```json
"scripts": {
	"deploy": "gh-pages -d dist"
}
```

### GitHub Actions 自动部署

项目使用GitHub Actions实现自动化部署流程，每次推送代码到main分支后会自动构建并部署到GitHub Pages。

#### 部署前准备

1. **Git仓库配置**
   - 确保项目已关联GitHub仓库
   - 将本地代码推送到仓库的main分支

2. **项目配置**
   - 在`vite.config.ts`中设置正确的base路径：
     ```typescript
     export default defineConfig({
       base: '/<REPO_NAME>/', // 如果部署在根域名，使用 '/'
       // ... 其他配置
     })
     ```
   - 确保`package.json`中包含正确的homepage字段：
     ```json
     "homepage": "https://<USERNAME>.github.io/<REPO_NAME>/",
     ```

3. **路由配置**
   - 如果使用Vue Router，建议使用hash模式避免刷新404问题：
     ```typescript
     import { createRouter, createWebHashHistory } from 'vue-router';

     const router = createRouter({
       history: createWebHashHistory(),
       routes: [...]
     });
     ```

#### 自动部署配置

在`.github/workflows/deploy.yml`配置GitHub Actions：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch: # 允许手动触发部署

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write # 确保有写入权限
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true # 清理旧文件
          token: ${{ secrets.GITHUB_TOKEN }} # 使用GitHub提供的token
```

#### 部署验证

部署完成后，可通过以下地址访问：
- `https://<USERNAME>.github.io/<REPO_NAME>/`

如遇部署问题，请检查：
- GitHub仓库设置中是否启用了Pages功能
- Pages来源是否设置为gh-pages分支
- 自定义域名配置是否正确

#### 优化建议

1. **性能优化**
   - 启用Vite构建时的代码分割功能
   - 配置合理的缓存策略
   - 启用Gzip压缩静态资源

2. **SEO优化**
   - 添加`robots.txt`和站点地图
   - 确保页面包含正确的meta标签

3. **部署流程优化**
   - 添加预部署和发布前测试步骤
   - 配置环境变量区分开发/生产环境
   - 实现版本回滚机制

4. **监控与分析**
   - 集成Google Analytics或百度统计
   - 添加错误监控和用户行为分析
   - 配置性能监测工具