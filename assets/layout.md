# Pistaink 界面布局设计

## 1. 主界面布局

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-------+  +-------------+                                   +------+ +-------+  |
|  | LOGO  |  | 语言切换(中/En) |                                   | 主题  | | 设置  |  |
|  +-------+  +-------------+                                   +------+ +-------+  |
|                                                                                   |
|                                                                                   |
|                 +-----------------------------------------------+                 |
|                 |               搜索引擎图标               | 🔍  |                 |
|                 +-----------------------------------------------+                 |
|                                                                                   |
|                     搜索引擎选择下拉菜单(点击搜索引擎图标显示)                         |
|                 +-----------------------------------------------+                 |
|                 |    [G]    |    [B]    |    [Y]    |           |                 |
|                 |  Google   |   Bing    |   Yahoo   |           |                 |
|                 |-----------|-----------|-----------|-----------|                 |
|                 |    [D]    |    [🦆]    |    [S]    |           |                 |
|                 | DuckDuck  |  Sogou    |  Startpage|           |                 |
|                 |-----------|-----------|-----------|-----------|                 |
|                 |    [B]    |    [3]    |    [+]    |           |                 |
|                 |   Baidu   |    360    | 添加搜索  |           |                 |
|                 +-----------------------------------------------+                 |
|                                                                                   |
|                                                                                   |
|                                                                                   |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|  |    [G]    |  |    [B]    |  |    [Z]    |  |    [C]    |  |    [G]    |       |
|  |  GitHub   |  |  Bilibili |  |   知乎    |  |  ChatGPT  |  |   Gitee   |       |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|                                                                                   |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|  |    [M]    |  |    [K]    |  |    [D]    |  |    [Y]    |  |    [T]    |       |
|  | Microsoft |  |   Kimi    |  | DeepSeek  |  |   豆包    |  |   翻译    |       |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|                                                                                   |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|  |    [W]    |  |    [L]    |  |    [C]    |  |    [T]    |  |    [+]    |       |
|  | 文心一言  |  |   灵码    |  |  Claude   |  |   TAPD    |  | 添加快捷方式 |    |
|  +-----------+  +-----------+  +-----------+  +-----------+  +-----------+       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

## 2. 设置界面布局

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------+                                                       +---------+     |
|  | < 返回 |                        设置                           |  完成   |     |
|  +--------+                                                       +---------+     |
|                                                                                   |
|  +---------------+                +-----------------------------------+           |
|  |               |                |                                   |           |
|  |  导入/导出    |                |                                   |           |
|  |               |                |                                   |           |
|  |  搜索引擎     |                |       根据左侧选项显示对应       |           |
|  |               |                |          设置内容区域            |           |
|  |  语言设置     |                |                                   |           |
|  |               |                |                                   |           |
|  |  背景设置     |                |                                   |           |
|  |               |                |                                   |           |
|  |  显示设置     |                |                                   |           |
|  |               |                |                                   |           |
|  |  关于         |                |                                   |           |
|  |               |                |                                   |           |
|  +---------------+                +-----------------------------------+           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

## 3. 快捷方式添加/编辑弹窗

```
+----------------------------------------+
|              编辑快捷方式              |
|                                        |
|  +----------------------------------+  |
|  |                                  |  |
|  |              图标               |  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  网站名称:                             |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  英文名称:                             |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  网址:                                 |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  +----------+         +-----------+   |
|  |   取消   |         |   保存    |   |
|  +----------+         +-----------+   |
|                                        |
+----------------------------------------+
```

## 4. 搜索引擎添加/编辑弹窗

```
+----------------------------------------+
|              添加搜索引擎              |
|                                        |
|  +----------------------------------+  |
|  |                                  |  |
|  |              图标               |  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  引擎名称:                             |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  英文名称:                             |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  搜索URL:                              |
|  +----------------------------------+  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  +----------+         +-----------+   |
|  |   取消   |         |   添加    |   |
|  +----------+         +-----------+   |
|                                        |
+----------------------------------------+
```

## 5. 语言设置界面

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  语言管理                                                                          |
|                                                                                   |
|  +------------------------------------------------------------------------+       |
|  |        |    pageTitle    |  searchPlaceholder  |  addShortcut  | ...   |       |
|  |--------+----------------+----------------------+-------------+---------|       |
|  |   zh   |   搜索首页      |  搜索或输入网址       |  添加快捷方式  | ...   |       |
|  |--------+----------------+----------------------+-------------+---------|       |
|  | zh-TW  |   搜尋首頁      |  搜尋或輸入網址       |  添加快捷方式  | ...   |       |
|  |--------+----------------+----------------------+-------------+---------|       |
|  |   en   | Search Homepage | Search or enter URL |  Add shortcut | ...   |       |
|  |--------+----------------+--------------------+---------------+---------|       |
|  |  +  添加语言                                                            |       |
|  +------------------------------------------------------------------------+       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

## 6. 搜索引擎管理界面

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  搜索引擎管理                                        +----------------------+     |
|                                                      |    添加搜索引擎      |     |
|  +------------------------------------------------------------------------+       |
|  |        |                |         |                    |               |       |
|  |  图标   |      名称      |   英文   |       搜索URL      |     操作      |       |
|  |--------|----------------|---------|--------------------+---------------|       |
|  |  [G]   |     谷歌       | Google  | https://google.com |   编辑 删除    |       |
|  |--------|----------------|---------|--------------------+---------------|       |
|  |  [B]   |     必应       |  Bing   | https://bing.com   |   编辑 删除    |       |
|  |--------|----------------|---------|--------------------+---------------|       |
|  |  [B]   |     百度       |  Baidu  | https://baidu.com  |   编辑 删除    |       |
|  |--------|----------------|---------|--------------------+---------------|       |
|  |  [D]   |   DuckDuckGo   | DuckDuck| https://duckduck.. |   编辑 删除    |       |
|  |--------|----------------|---------|--------------------+---------------|       |
|  |  ...   |     ...        |   ...   |       ...          |      ...      |       |
|  +------------------------------------------------------------------------+       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```