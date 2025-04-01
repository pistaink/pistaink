import { definePlugin } from '@/plugins/core/plugin-system';
import { ref } from 'vue';

// 颜色示例
const sampleColors = [
	'#ff5252', '#ff4081', '#e040fb', '#7c4dff',
	'#536dfe', '#448aff', '#40c4ff', '#18ffff',
	'#64ffda', '#69f0ae', '#b2ff59', '#eeff41',
	'#ffff00', '#ffd740', '#ffab40', '#ff6e40'
];

export default definePlugin({
	id: 'color-picker',
	name: '颜色提取器',
	description: '从网页中提取主要颜色',
	icon: '🎨',
	version: '1.0.0',
	
	// 安装插件
	install(app) {
		console.log('颜色提取器插件已安装');
	},
	
	// 点击插件图标时触发
	onActivate() {
		// 创建颜色提取器面板
		const panel = document.createElement('div');
		panel.className = 'color-picker-panel';
		
		// 面板标题
		const header = document.createElement('div');
		header.className = 'color-picker-header';
		header.innerHTML = `
			<h3>颜色提取器</h3>
			<button class="color-picker-close">×</button>
		`;
		panel.appendChild(header);
		
		// 颜色展示区域
		const colorGrid = document.createElement('div');
		colorGrid.className = 'color-grid';
		
		// 添加示例颜色
		sampleColors.forEach(color => {
			const colorItem = document.createElement('div');
			colorItem.className = 'color-item';
			colorItem.style.backgroundColor = color;
			colorItem.setAttribute('data-color', color);
			
			colorItem.addEventListener('click', () => {
				// 复制颜色值到剪贴板
				navigator.clipboard.writeText(color).then(() => {
					// 显示复制成功提示
					colorItem.setAttribute('data-copied', 'true');
					colorItem.innerText = '已复制';
					
					setTimeout(() => {
						colorItem.innerText = '';
						colorItem.removeAttribute('data-copied');
					}, 1000);
				});
			});
			
			colorGrid.appendChild(colorItem);
		});
		
		panel.appendChild(colorGrid);
		
		// 提示文本
		const hint = document.createElement('p');
		hint.className = 'color-picker-hint';
		hint.textContent = '点击颜色块复制色值';
		panel.appendChild(hint);
		
		// 添加到页面
		document.body.appendChild(panel);
		
		// 关闭按钮事件
		const closeBtn = panel.querySelector('.color-picker-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				document.body.removeChild(panel);
			});
		}
		
		// 添加样式
		const style = document.createElement('style');
		style.textContent = `
		.color-picker-panel {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 320px;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1000;
			overflow: hidden;
		}
		
		.color-picker-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
		}
		
		.color-picker-header h3 {
			margin: 0;
			font-size: 16px;
		}
		
		.color-picker-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		.color-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 8px;
			padding: 16px;
		}
		
		.color-item {
			position: relative;
			width: 100%;
			height: 60px;
			border-radius: 4px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 12px;
			font-weight: bold;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
			transition: transform 0.2s;
		}
		
		.color-item:hover {
			transform: scale(1.05);
		}
		
		.color-item[data-copied="true"] {
			outline: 2px solid #333;
		}
		
		.color-picker-hint {
			text-align: center;
			color: #666;
			padding: 0 16px 16px;
			margin: 0;
			font-size: 12px;
		}
		`;
		
		document.head.appendChild(style);
	},
	
	// 插件被禁用时
	onDeactivate() {
		console.log('颜色提取器插件已禁用');
	}
}); 