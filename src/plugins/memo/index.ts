import { definePlugin } from '@/plugins/core/plugin-system';
import { ref } from 'vue';

// 存储键
const MEMO_STORAGE_KEY = 'pistaink_memos';

// 便签接口
interface IMemo {
	id: string;
	content: string;
	color: string;
	createdAt: number;
}

// 获取已保存的便签
function getSavedMemos(): IMemo[] {
	try {
		const saved = localStorage.getItem(MEMO_STORAGE_KEY);
		return saved ? JSON.parse(saved) : [];
	} catch (error) {
		console.error('加载便签失败:', error);
		return [];
	}
}

// 保存便签
function saveMemos(memos: IMemo[]): void {
	localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
}

// 生成随机颜色
function getRandomColor(): string {
	const colors = [
		'#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9',
		'#c5cae9', '#bbdefb', '#b3e5fc', '#b2ebf2',
		'#b2dfdb', '#c8e6c9', '#dcedc8', '#f0f4c3',
		'#fff9c4', '#ffecb3', '#ffe0b2', '#ffccbc'
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export default definePlugin({
	id: 'memo',
	name: '便签',
	description: '创建和管理便签',
	icon: '📝',
	version: '1.0.0',
	
	// 安装插件
	install(app) {
		console.log('便签插件已安装');
	},
	
	// 点击插件图标时触发
	onActivate() {
		// 获取保存的便签
		const memos = getSavedMemos();
		
		// 创建便签面板
		const panel = document.createElement('div');
		panel.className = 'memo-panel';
		
		// 面板标题
		const header = document.createElement('div');
		header.className = 'memo-header';
		header.innerHTML = `
			<h3>我的便签</h3>
			<button class="memo-close">×</button>
		`;
		panel.appendChild(header);
		
		// 便签列表
		const memoList = document.createElement('div');
		memoList.className = 'memo-list';
		
		// 渲染便签
		function renderMemos() {
			memoList.innerHTML = '';
			
			if (memos.length === 0) {
				const emptyMessage = document.createElement('p');
				emptyMessage.className = 'memo-empty';
				emptyMessage.textContent = '没有便签，点击下方按钮添加';
				memoList.appendChild(emptyMessage);
			} else {
				memos.forEach((memo, index) => {
					const memoItem = document.createElement('div');
					memoItem.className = 'memo-item';
					memoItem.style.backgroundColor = memo.color;
					
					// 便签内容
					const content = document.createElement('div');
					content.className = 'memo-content';
					content.textContent = memo.content;
					memoItem.appendChild(content);
					
					// 便签日期
					const date = document.createElement('div');
					date.className = 'memo-date';
					date.textContent = new Date(memo.createdAt).toLocaleString();
					memoItem.appendChild(date);
					
					// 删除按钮
					const deleteBtn = document.createElement('button');
					deleteBtn.className = 'memo-delete';
					deleteBtn.textContent = '删除';
					deleteBtn.addEventListener('click', (e) => {
						e.stopPropagation();
						memos.splice(index, 1);
						saveMemos(memos);
						renderMemos();
					});
					memoItem.appendChild(deleteBtn);
					
					memoList.appendChild(memoItem);
				});
			}
		}
		
		renderMemos();
		panel.appendChild(memoList);
		
		// 添加便签按钮
		const addBtn = document.createElement('button');
		addBtn.className = 'memo-add-btn';
		addBtn.textContent = '添加便签';
		addBtn.addEventListener('click', () => {
			const content = prompt('请输入便签内容:');
			if (content && content.trim()) {
				const newMemo: IMemo = {
					id: Date.now().toString(),
					content: content.trim(),
					color: getRandomColor(),
					createdAt: Date.now()
				};
				
				memos.unshift(newMemo);
				saveMemos(memos);
				renderMemos();
			}
		});
		panel.appendChild(addBtn);
		
		// 添加到页面
		document.body.appendChild(panel);
		
		// 关闭按钮事件
		const closeBtn = panel.querySelector('.memo-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				document.body.removeChild(panel);
			});
		}
		
		// 添加样式
		const style = document.createElement('style');
		style.textContent = `
		.memo-panel {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 320px;
			max-height: 80vh;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1000;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}
		
		.memo-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
			background-color: #f5f5f5;
		}
		
		.memo-header h3 {
			margin: 0;
			font-size: 16px;
		}
		
		.memo-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		.memo-list {
			flex: 1;
			overflow-y: auto;
			padding: 8px;
			max-height: 400px;
		}
		
		.memo-empty {
			text-align: center;
			color: #999;
			padding: 20px;
		}
		
		.memo-item {
			position: relative;
			padding: 12px;
			margin-bottom: 8px;
			border-radius: 4px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
		
		.memo-content {
			margin-bottom: 8px;
			white-space: pre-wrap;
			word-break: break-word;
		}
		
		.memo-date {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.6);
		}
		
		.memo-delete {
			position: absolute;
			top: 8px;
			right: 8px;
			background: rgba(255, 255, 255, 0.5);
			border: none;
			border-radius: 4px;
			padding: 2px 6px;
			font-size: 12px;
			cursor: pointer;
			opacity: 0;
			transition: opacity 0.2s;
		}
		
		.memo-item:hover .memo-delete {
			opacity: 1;
		}
		
		.memo-add-btn {
			margin: 8px;
			padding: 8px;
			background-color: #2196f3;
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			font-weight: bold;
			transition: background-color 0.2s;
		}
		
		.memo-add-btn:hover {
			background-color: #1976d2;
		}
		`;
		
		document.head.appendChild(style);
	},
	
	// 插件被禁用时
	onDeactivate() {
		console.log('便签插件已禁用');
	}
}); 