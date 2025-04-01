<template>
	<div class="drawing-container">
		<div class="drawing-tools">
			<div class="tool-group">
				<button 
					class="tool-btn"
					:class="{ active: currentTool === 'brush' }"
					@click="setTool('brush')"
					title="画笔"
				>
					🖌️
				</button>
				<button 
					class="tool-btn"
					:class="{ active: currentTool === 'eraser' }"
					@click="setTool('eraser')"
					title="橡皮擦"
				>
					🧽
				</button>
			</div>
			
			<div class="color-picker">
				<div 
					v-for="color in colors" 
					:key="color"
					class="color-option"
					:style="{ background: color }"
					:class="{ active: currentColor === color }"
					@click="setColor(color)"
				></div>
			</div>
			
			<div class="size-selector">
				<input 
					type="range" 
					min="1" 
					max="50" 
					v-model.number="brushSize" 
					class="size-slider"
				/>
				<span class="size-value">{{ brushSize }}px</span>
			</div>
			
			<div class="background-selector">
				<span>背景:</span>
				<div 
					v-for="bgColor in backgroundColors" 
					:key="bgColor"
					class="bg-color-option"
					:style="{ background: bgColor }"
					:class="{ active: canvasBackgroundColor === bgColor }"
					@click="setBackgroundColor(bgColor)"
				></div>
			</div>
		</div>
		
		<div class="canvas-wrapper">
			<canvas 
				ref="canvas"
				class="drawing-canvas"
				@mousedown="startDrawing"
				@mousemove="draw"
				@mouseup="stopDrawing"
				@mouseleave="stopDrawing"
				@touchstart="handleTouchStart"
				@touchmove="handleTouchMove"
				@touchend="stopDrawing"
			></canvas>
		</div>
		
		<div class="canvas-actions">
			<button class="action-btn" @click="clearCanvas">清除</button>
			<button class="action-btn" @click="saveImage">保存</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false
let lastX = 0
let lastY = 0

// 工具和设置
const currentTool = ref('brush')
const currentColor = ref('#000000')
const brushSize = ref(5)
const colors = [
	'#000000', '#ffffff', '#ff0000', '#ff9900', 
	'#ffff00', '#00ff00', '#0099ff', '#6633ff'
]

// 背景颜色
const canvasBackgroundColor = ref('#ffffff')
const backgroundColors = [
	'#ffffff', '#f0f0f0', '#f5f5dc', '#e0f7fa', 
	'#f9fbe7', '#fff3e0', '#fbe9e7', '#f3e5f5'
]

// 监听背景颜色变化
watch(canvasBackgroundColor, () => {
	applyBackgroundColor()
})

// 设置背景颜色
function setBackgroundColor(color: string) {
	canvasBackgroundColor.value = color
}

// 应用背景颜色
function applyBackgroundColor() {
	if (!ctx || !canvas.value) return
	
	// 保存当前画布内容
	const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
	
	// 应用新背景色
	ctx.fillStyle = canvasBackgroundColor.value
	ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
	
	// 恢复画布内容
	ctx.putImageData(imageData, 0, 0)
}

// 设置画布
onMounted(() => {
	if (!canvas.value) return
	
	// 设置画布大小
	resizeCanvas()
	
	// 获取上下文
	ctx = canvas.value.getContext('2d')
	
	// 设置默认样式
	if (ctx) {
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.strokeStyle = currentColor.value
		ctx.lineWidth = brushSize.value
		
		// 设置背景
		ctx.fillStyle = canvasBackgroundColor.value
		ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
	}
	
	// 监听窗口大小变化
	window.addEventListener('resize', resizeCanvas)
})

// 调整画布大小
function resizeCanvas() {
	if (!canvas.value) return
	
	const canvasWrapper = canvas.value.parentElement
	if (!canvasWrapper) return
	
	canvas.value.width = canvasWrapper.clientWidth
	canvas.value.height = 300 // 固定高度300px
	
	// 重新设置背景色
	if (ctx) {
		ctx.fillStyle = canvasBackgroundColor.value
		ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
	}
}

// 设置工具
function setTool(tool: string) {
	currentTool.value = tool
}

// 设置颜色
function setColor(color: string) {
	currentColor.value = color
	if (ctx) {
		ctx.strokeStyle = color
	}
}

// 开始绘画
function startDrawing(e: MouseEvent) {
	isDrawing = true
	// 记录起始位置
	const rect = canvas.value!.getBoundingClientRect()
	lastX = e.clientX - rect.left
	lastY = e.clientY - rect.top
}

// 绘画
function draw(e: MouseEvent) {
	if (!isDrawing || !ctx || !canvas.value) return
	
	// 获取当前位置
	const rect = canvas.value.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top
	
	// 设置样式
	ctx.strokeStyle = currentTool.value === 'eraser' ? canvasBackgroundColor.value : currentColor.value
	ctx.lineWidth = brushSize.value
	
	// 绘制线条
	ctx.beginPath()
	ctx.moveTo(lastX, lastY)
	ctx.lineTo(x, y)
	ctx.stroke()
	
	// 更新位置
	lastX = x
	lastY = y
}

// 停止绘画
function stopDrawing() {
	isDrawing = false
}

// 处理触摸开始
function handleTouchStart(e: TouchEvent) {
	if (!canvas.value) return
	e.preventDefault()
	
	const touch = e.touches[0]
	const rect = canvas.value.getBoundingClientRect()
	lastX = touch.clientX - rect.left
	lastY = touch.clientY - rect.top
	isDrawing = true
}

// 处理触摸移动
function handleTouchMove(e: TouchEvent) {
	if (!isDrawing || !ctx || !canvas.value) return
	e.preventDefault()
	
	const touch = e.touches[0]
	const rect = canvas.value.getBoundingClientRect()
	const x = touch.clientX - rect.left
	const y = touch.clientY - rect.top
	
	// 设置样式
	ctx.strokeStyle = currentTool.value === 'eraser' ? canvasBackgroundColor.value : currentColor.value
	ctx.lineWidth = brushSize.value
	
	// 绘制线条
	ctx.beginPath()
	ctx.moveTo(lastX, lastY)
	ctx.lineTo(x, y)
	ctx.stroke()
	
	// 更新位置
	lastX = x
	lastY = y
}

// 清除画布
function clearCanvas() {
	if (!ctx || !canvas.value) return
	
	ctx.fillStyle = canvasBackgroundColor.value
	ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

// 保存图片
function saveImage() {
	if (!canvas.value) return
	
	// 创建下载链接
	const url = canvas.value.toDataURL('image/png')
	const link = document.createElement('a')
	link.download = `pistaink-drawing-${new Date().getTime()}.png`
	link.href = url
	link.click()
}
</script>

<style lang="scss" scoped>
.drawing-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	background: white;
	border-radius: 8px;
	padding: 16px;
}

.drawing-tools {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid #eee;
	
	.tool-group {
		display: flex;
		gap: 8px;
	}
	
	.tool-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		
		&.active {
			border-color: #0066cc;
			background-color: #e6f2ff;
		}
	}
	
	.color-picker {
		display: flex;
		gap: 4px;
	}
	
	.color-option {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid #ddd;
		cursor: pointer;
		
		&.active {
			border: 2px solid #0066cc;
		}
	}
	
	.size-selector {
		display: flex;
		align-items: center;
		gap: 8px;
		
		.size-slider {
			width: 100px;
		}
		
		.size-value {
			min-width: 40px;
			text-align: center;
		}
	}
	
	.background-selector {
		display: flex;
		align-items: center;
		gap: 8px;
		
		.bg-color-option {
			width: 20px;
			height: 20px;
			border-radius: 4px;
			border: 1px solid #ddd;
			cursor: pointer;
			
			&.active {
				border: 2px solid #0066cc;
			}
		}
	}
}

.canvas-wrapper {
	width: 100%;
	background-color: white;
	border: 1px solid #ddd;
	border-radius: 4px;
	overflow: hidden;
}

.drawing-canvas {
	display: block;
	width: 100%;
	background: white;
}

.canvas-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	
	.action-btn {
		padding: 8px 16px;
		border: none;
		background-color: #f0f0f0;
		border-radius: 4px;
		cursor: pointer;
		
		&:hover {
			background-color: #e0e0e0;
		}
	}
}

@media (max-width: 768px) {
	.drawing-tools {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		
		.background-selector {
			.bg-color-option {
				width: 16px;
				height: 16px;
			}
		}
	}
}
</style> 