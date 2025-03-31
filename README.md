# pistaink.com 
这是一个部署在github page上的静态网站工程，主要提供的

## 界面布局
1. 主界面
2. 设置界面
3. 快捷方式添加弹窗
4. 搜索引擎添加弹窗

## 功能说明
1. 这是一个导航网页首页工程，目标是方便管理网页快捷方式。
2. 界面上的所有配置，都能配置在一个json数据文件中，能导入配置实现设置。修改配置，也会修改json文件
3. 界面最上面时工具栏，靠右自然排序功能有：语言切换（切换语言），设置按钮。设置按钮点击，打开首页设置面板，设置面板显示全屏挡住首页。
4. 设置面板，左侧是纵向的功能选项列表，右侧则是具体的功能面板。需要如下功能：
   - 导入：导入json格式的首页配置，如同 /static/default.json 的结构
   - 导出：导出json格式的首页配置
   - 搜索引擎：功能面板中，左侧是各种搜索引擎选项列表（增删改查），右侧上面id表示，以及url, 下面是名称的各种语言翻译的列表，可以增删改查。
   - 语言添加：功能面板是一个表格，横向是罗列所有的界面中用到的key，纵向是不同语言下 key对应的翻译。表格出来一行，第一列固定外，可以左右上下滑动。第一行可以添加新key,删除旧key。第一列也可以添加新的语言，删除旧语言
5. 中间上面，是如同 www.bing.com 首页的的搜索框，搜索框左边是搜索引擎切换按钮（显示搜索引擎icon），搜索框右侧是搜索按钮。搜索引擎切换按钮，点击触发下拉菜单，下拉菜单采用grid排列，3个一行，从左往右，从上往下自动排列，下拉菜单末尾自动添加 【添加搜索引擎】，点击打开【搜索引擎添加弹窗】
6. 搜索引擎添加弹窗：是一个类似于设置面板中的搜索引擎添加，是简单版本的，只需要包含url，以及默认名称。
7. 中下部是快捷方式排列面板。排列面板中采用Grid排列网页快捷方式，排列顺序是，从左往右，从上往下。整个快捷方式排列面板是可以上下滑动的。
8. 快捷方式：显示大小 80x80 px, 中上部是 icon, 下发是缩略名字。右上角是3给点的编辑按钮。编辑按钮点击，弹出快捷方式编辑弹窗。
9. 快捷方式弹窗：最上面是icon，中间是网页快捷方式名称的编辑。下面是网页快捷方式URL的编辑。
10. 背景：需要每天从bing首页自动获取首页照片url，然后自动设置成当前页的首页
11. 添加 网页快捷方式，以及 搜索引擎，我们这里并不会上传icon，这里需要设计一个爬取icon工具，自动从对应网站自动爬取，然后自动存储到网页的localstorage中。
12. 帮我添加 github 工作留，每次提交后，自动部署 github page 静态网页。

## 技术栈
- **TypeScripte** 
- **Vue3**
- **Vite4** 

### 基本规则
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
11. 控制台操作，使用windows兼容的命令
12. 使用ES6模块和类：每个功能都被封装为一个类，并使用单例模式导出，方便在其他模块中使用。
13. 使用事件总线：替换了原先的回调注册方式，减少了模块间的直接依赖。
14. 关注点分离：每个模块专注于特定功能，提高了代码的可维护性。
15. 错误处理和日志：增加了全面的错误捕获和日志记录。
16. 代码组织：文件结构符合三层架构，便于理解和维护。

## 目录结构
三层架构：
```
├── core/               # 核心层
│   ├── data-manager.js      # 数据核心
│   ├── event-bus.js         # 事件总线
│   ├── settings-manager.js  # 全局设置管理
│   └── index.js             # 核心层导出
│
├── features/           # 功能层
│   ├── shortcuts/           # 快捷方式相关
│   │   ├── shortcut-manager.js
│   │   ├── shortcut-drag.js      # 专注于拖拽功能
│   │   ├── shortcut-editor.js    # 专注于编辑功能
│   │   └── index.js              # 快捷方式模块导出
│   │
│   ├── search/              # 搜索引擎相关
│   │   ├── engine-manager.js
│   │   ├── search-box.js
│   │   └── index.js         # 搜索模块导出
│   │
│   ├── ui/                  # UI相关
│   │   ├── edit-mode.js
│   │   ├── background.js
│   │   ├── theme.js         # 主题管理
│   │   ├── virtual-list.js  # 虚拟列表组件
│   │   └── index.js         # UI模块导出
│   │
│   └── i18n/                # 国际化相关
│       ├── language-manager.js
│       ├── language-apply.js
│       └── index.js         # 国际化模块导出
│
├── utils/              # 工具层
│   ├── utils.js            # 通用工具函数
│   ├── icon-fetcher.js     # 图标获取器
│   ├── storage.js          # 存储抽象
│   ├── pinyin.js           # 拼音工具
│   └── index.js            # 工具层导出
│
└── app.js                  # 主应用入口
```

## 通信机制
引入事件总线（Event Bus）模式，减少模块间的直接依赖
使用发布-订阅模式代替当前的回调注册方式
示例实现：

// event-bus.js
const EventBus = (function() {
    const events = {};
    
    function subscribe(event, callback) {
        if (!events[event]) events[event] = [];
        events[event].push(callback);
        return () => unsubscribe(event, callback);
    }
    
    function publish(event, data) {
        if (!events[event]) return;
        events[event].forEach(callback => callback(data));
    }
    
    function unsubscribe(event, callback) {
        if (!events[event]) return;
        events[event] = events[event].filter(cb => cb !== callback);
    }
    
    return { subscribe, publish, unsubscribe };
})();

## 数据流优化
采用单向数据流模式，通过 DataManager 作为唯一数据源
各功能模块不直接修改数据，而是通过事件总线请求 DataManager 修改
修改后的数据再通过事件总线通知各模块更新界面