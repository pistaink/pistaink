import { definePlugin } from '@/plugins/core/plugin-system';
import DrawingComponent from './DrawingCanvas.vue';
import { ref, createApp } from 'vue';

// 创建模态框状态
const isDrawingModalOpen = ref(false);

export default definePlugin({
	id: 'drawing',
	name: '绘画板',
	description: '简易绘画工具，支持多种画笔和颜色',
	icon: '✏️',
	version: '1.0.0',
	component: DrawingComponent,
	
	// 安装插件
	install(app) {
		// 可以在这里注册全局组件或添加全局属性
		console.log('绘画插件已安装');
	},
	
	// 点击插件图标时触发
	onActivate() {
		isDrawingModalOpen.value = true;
		
		// 创建模态框
		const modal = document.createElement('div');
		modal.classList.add('drawing-modal');
		
		// 模态框内容
		modal.innerHTML = `
		<div class="drawing-modal-backdrop"></div>
		<div class="drawing-modal-content">
			<div class="drawing-modal-header">
				<h3>绘画板</h3>
				<button class="drawing-modal-close">×</button>
			</div>
			<div id="drawing-container"></div>
		</div>
		`;
		
		// 添加到页面
		document.body.appendChild(modal);
		
		// 渲染组件
		const container = document.getElementById('drawing-container');
		if (container) {
			const drawingApp = createApp(DrawingComponent);
			drawingApp.mount(container);
		}
		
		// 关闭按钮事件
		const closeBtn = modal.querySelector('.drawing-modal-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				document.body.removeChild(modal);
				isDrawingModalOpen.value = false;
			});
		}
		
		// 点击背景关闭
		const backdrop = modal.querySelector('.drawing-modal-backdrop');
		if (backdrop) {
			backdrop.addEventListener('click', () => {
				document.body.removeChild(modal);
				isDrawingModalOpen.value = false;
			});
		}
		
		// 添加样式
		const style = document.createElement('style');
		style.textContent = `
		.drawing-modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.drawing-modal-backdrop {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
		}
		
		.drawing-modal-content {
			position: relative;
			width: 80%;
			max-width: 800px;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1001;
			overflow: hidden;
		}
		
		.drawing-modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
		}
		
		.drawing-modal-header h3 {
			margin: 0;
		}
		
		.drawing-modal-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		@media (max-width: 768px) {
			.drawing-modal-content {
				width: 95%;
			}
		}
		`;
		document.head.appendChild(style);
	},
	
	// 插件被禁用时
	onDeactivate() {
		console.log('绘画插件已禁用');
	}
}); 