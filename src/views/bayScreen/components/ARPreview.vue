<template>
  <div>
    <el-dialog v-model="visible" width="60%" top="10vh" :show-close="false" title="AR预览" class="bay-dialog"
      :before-close="handleClose" destroy-on-close @opened="onDialogOpened">
      <div class="title">
        <span>{{ currentScene?.name || 'AR预览' }}</span>
        <div class="header-controls">
          <el-tooltip content="全屏" placement="bottom">
            <el-icon @click="toggleFullscreen" class="control-icon">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="关闭" placement="bottom">
            <el-icon @click="onClose" class="control-icon">
              <CloseBold />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <!-- AR容器 -->
      <div ref="pannellumViewer" class="AR-container" :class="{ fullscreen: isFullscreen }"></div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="scene-selector" v-if="scenes.length > 1">
          <span class="label">场景选择：</span>
          <el-select v-model="currentSceneId" @change="switchScene" :teleported="false" class="select-bay"
            popper-class="el_select_popper" style="width: 150px">
            <el-option v-for="scene in scenes" :key="scene.id" :label="scene.name" :value="scene.id" />
          </el-select>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted, computed } from 'vue'
import { CloseBold, FullScreen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'pannellum/build/pannellum.css'
import 'pannellum'

declare global {
  interface Window {
    pannellum: any
    switchToScene: (sceneId: string) => void
    showHotSpotInfo: (text: string) => void
  }
}

// 类型定义
interface ARScene {
  id: string
  name: string
  panorama: string
  hotSpots?: HotSpot[]
  initialView?: {
    pitch?: number
    yaw?: number
    fov?: number
  }
}

interface HotSpot {
  id?: string
  pitch: number
  yaw: number
  type: 'scene' | 'info'
  text: string
  sceneId?: string
  clickHandlerFunc?: string
  clickHandlerArgs?: any[]
}

interface ARConfig {
  scenes: ARScene[]
  defaultSceneId?: string
  showControls?: boolean
  autoLoad?: boolean
  showInfo?: boolean
}

// 响应式数据
const viewer = ref<any>(null)
const pannellumViewer = ref<HTMLElement | null>(null)
const visible = ref(false)
const isFullscreen = ref(false)
const currentSceneId = ref('')
const scenes = ref<ARScene[]>([])
const pendingConfig = ref<ARConfig | null>(null)

// 计算属性
const currentScene = computed(() => scenes.value.find((scene) => scene.id === currentSceneId.value))

// 方法定义
const open = async (config: ARConfig) => {
  // 保存配置
  pendingConfig.value = config
  scenes.value = config.scenes || []
  currentSceneId.value = config.defaultSceneId || config.scenes?.[0]?.id || ''

  // 打开对话框
  visible.value = true
}

const onDialogOpened = async () => {
  if (!pendingConfig.value) return
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 200))

  if (pannellumViewer.value && pendingConfig.value) {
    await initAR(pendingConfig.value)
    pendingConfig.value = null
  }
}

const initAR = async (config: ARConfig) => {
  if (!pannellumViewer.value || !currentScene.value || !window.pannellum) {
    console.error('AR初始化条件不满足', {
      pannellumViewer: !!pannellumViewer.value,
      currentScene: !!currentScene.value,
      pannellum: !!window.pannellum
    })
    return
  }

  // 销毁之前的viewer
  if (viewer.value) {
    viewer.value.destroy()
    viewer.value = null
  }

  const scene = currentScene.value
  const viewerConfig: any = {
    type: 'equirectangular',
    panorama: scene.panorama,
    autoLoad: true,
    showControls: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    mouseZoom: true,
    doubleClickZoom: false,
    draggable: true,
    keyboardZoom: true,
    compass: false,
    northOffset: 0,
    preview: '',
    previewTitle: '',
    previewAuthor: '',
    hotSpotDebug: false,
    backgroundColor: [0, 0, 0],
    avoidShowingBackground: false,
    minHfov: 50,
    maxHfov: 120,
    minPitch: -90,
    maxPitch: 90,
    hfov: 75,
    pitch: 0,
    yaw: 0,
    ...scene.initialView
  }
  viewer.value = window.pannellum.viewer(
    pannellumViewer.value,
    viewerConfig
  )(window as any).switchToScene = (sceneId: string) => {
    const targetScene = scenes.value.find((s) => s.id === sceneId)
    if (targetScene && sceneId !== currentSceneId.value) {
      switchScene(sceneId)
    }
  }
    ; (window as any).showHotSpotInfo = (info: string) => {
      ElMessage.info(info)
    }
}

const switchScene = async (sceneId: string) => {
  currentSceneId.value = sceneId
  // 初始化AR
  await initAR({
    scenes: scenes.value,
    defaultSceneId: sceneId,
    showControls: true,
    autoLoad: true,
    showInfo: true
  })
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    pannellumViewer.value?.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

const handleClose = () => {
  if (isFullscreen.value) {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
  onClose()
}

const onClose = () => {
  if (viewer.value) {
    viewer.value.destroy()
    viewer.value = null
  }
  visible.value = false
  scenes.value = []
  currentSceneId.value = ''
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

// 组件卸载时清理
onUnmounted(() => {
  if (viewer.value) {
    viewer.value.destroy()
  }
  // 清理全局函数
  delete (window as any).switchToScene
  delete (window as any).showHotSpotInfo
})

defineExpose({ open })
</script>

<style lang="scss" scoped>
.header-controls {
  display: flex;
  gap: vw(12);
  align-items: center;

  .control-icon {
    cursor: pointer;
    font-size: vw(18);
    color: #fff;
    transition: all 0.3s ease;

    &:hover {
      color: #409eff;
      transform: scale(1.1);
    }
  }
}

.title {
  margin-bottom: vh(16);
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.AR-container {
  width: 100%;
  height: vh(700);
  border-radius: vw(8);
  overflow: hidden;
  background: #000;
  position: relative;

  &.fullscreen {
    height: 100vh;
    border-radius: 0;
  }
}

.control-panel {
  margin-top: vw(16);
  padding: vw(16);
  background: rgba(255, 255, 255, 0.05);
  border-radius: vw(8);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .scene-selector {
    display: flex;
    align-items: center;
    gap: vw(8);

    .label {
      color: #fff;
      font-size: vw(14);
      white-space: nowrap;
    }
  }
}

:deep(.pnlm-panorama-info) {
  display: none !important;
}
</style>
