import { definePlugin } from '@/plugins/core/plugin-system';
import { ref } from 'vue';

// 模态窗口状态
const isModalOpen = ref(false);

export default definePlugin({
	id: 'screenshot',
	name: '网页截图',
	description: '截取当前网页并保存',
	icon: '📷',
	version: '1.0.0',
	
	// 安装插件
	install(app) {
		console.log('截图插件已安装');
	},
	
	// 点击插件图标时触发
	onActivate() {
		// 显示提示信息
		const toast = document.createElement('div');
		toast.textContent = '正在截取屏幕...';
		toast.style.cssText = `
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			padding: 8px 16px;
			border-radius: 4px;
			z-index: 10000;
		`;
		document.body.appendChild(toast);
		
		// 等待DOM更新
		setTimeout(() => {
			// 使用html2canvas或其他截图库进行截图
			// 这里模拟截图过程
			setTimeout(() => {
				document.body.removeChild(toast);
				
				// 创建画布并进行截图
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				
				// 设置画布大小为视口大小
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				
				// 填充背景色
				if (ctx) {
					ctx.fillStyle = 'white';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					
					// 添加文本
					ctx.font = '24px Arial';
					ctx.fillStyle = 'black';
					ctx.textAlign = 'center';
					ctx.fillText('屏幕截图功能示例', canvas.width / 2, canvas.height / 2);
					
					// 添加时间戳
					ctx.font = '16px Arial';
					ctx.fillText(`时间: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height / 2 + 40);
					
					// 下载图片
					const url = canvas.toDataURL('image/png');
					const link = document.createElement('a');
					link.download = `screenshot-${new Date().getTime()}.png`;
					link.href = url;
					link.click();
				}
			}, 500);
		}, 100);
	},
	
	// 插件被禁用时
	onDeactivate() {
		console.log('截图插件已禁用');
	}
}); 