<template>
	<div class="plugin-registry" style="display: flex; align-items: center; gap: 8px;">
		<!-- 调试信息 -->
		<div v-if="enabledPlugins.length === 0" class="plugin-empty" style="color: #666; font-size: 12px;">
			加载插件中...
		</div>
		<div 
			v-for="plugin in enabledPlugins" 
			:key="plugin.id"
			class="plugin-item"
			@click="activatePlugin(plugin.id)"
			:title="plugin.name"
			style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; 
			border-radius: 50%; background-color: rgba(255, 255, 255, 0.3); border: 1px solid rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(4px); cursor: pointer; transition: all 0.2s ease;"
		>
			<div class="plugin-icon" style="font-size: 20px;">{{ plugin.icon }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { pluginManager } from './plugin-system';
import type { IPlugin } from '@/types/plugin';

// 已启用的插件列表
const enabledPlugins = ref<IPlugin[]>([]);

// 加载插件
onMounted(() => {
	console.log('PluginRegistry mounted');
	// 确保在组件挂载后刷新插件列表
	setTimeout(() => {
		refreshPlugins();
		// 打印调试信息
		console.log('Registered plugins:', pluginManager.getAllPlugins());
		console.log('Enabled plugins:', enabledPlugins.value);
	}, 100);
});

// 刷新插件列表
function refreshPlugins() {
	const plugins = pluginManager.getEnabledPlugins();
	console.log('Refreshing plugins, found:', plugins.length);
	enabledPlugins.value = plugins;
}

// 激活插件
function activatePlugin(id: string) {
	console.log('Activating plugin:', id);
	const plugin = pluginManager.getAllPlugins().find(p => p.id === id);
	if (plugin && plugin.onActivate) {
		plugin.onActivate();
	}
}
</script>

<style lang="scss" scoped>
.plugin-registry {
	display: flex;
	align-items: center;
	gap: 8px;
}

.plugin-item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.3);
	border: 1px solid rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(4px);
	cursor: pointer;
	transition: all 0.2s ease;
	
	&:hover {
		background-color: rgba(255, 255, 255, 0.5);
		transform: scale(1.05);
	}
	
	.plugin-icon {
		font-size: 20px;
	}
}
</style> 