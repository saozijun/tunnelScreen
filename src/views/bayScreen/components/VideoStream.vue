<template>
  <div class="video-container">
    <video ref="videoElement" muted autoplay class="video-player">
      您的浏览器不支持视频播放
    </video>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">视频流加载中，请稍候...</div>
    </div>

    <div v-if="!isSupported" class="error-message">当前浏览器不支持 FLV 播放</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import flvjs from 'flv.js'

const props = defineProps({
  streamUrl: {
    type: String,
    default: ''
  }
})



const videoElement = ref<HTMLVideoElement>()
const flvPlayer = ref<flvjs.Player | null>(null)
const isSupported = ref(false)
const isLoading = ref(false)

// 检查浏览器支持
onMounted(async () => {
  isSupported.value = flvjs.isSupported()

  // 如果有streamUrl，自动开始加载
  if (props.streamUrl && isSupported.value) {
    await nextTick()
    createPlayer()
  }
})

// 监听streamUrl变化
watch(() => props.streamUrl, (newUrl) => {
  if (newUrl && isSupported.value) {
    createPlayer()
  } else {
    destroyPlayer()
  }
})

const createPlayer = async () => {
  if (!videoElement.value || !props.streamUrl || !isSupported.value) return

  try {
    destroyPlayer()
    flvPlayer.value = flvjs.createPlayer(
      {
        type: 'flv',
        url: props.streamUrl,
        isLive: true
      },
      {
        enableWorker: false,
        enableStashBuffer: false,
        stashInitialSize: 128,
        lazyLoad: true,
        lazyLoadMaxDuration: 180,
        lazyLoadRecoverDuration: 30,
        deferLoadAfterSourceOpen: false,
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 180,
        autoCleanupMinBackwardDuration: 120
      }
    )

    flvPlayer.value.attachMediaElement(videoElement.value)

    flvPlayer.value.on(flvjs.Events.ERROR, () => {
      isLoading.value = false
    })

    flvPlayer.value.on(flvjs.Events.METADATA_ARRIVED, () => {
      isLoading.value = false
    })

    flvPlayer.value.on(flvjs.Events.LOADING_COMPLETE, () => {
      isLoading.value = false
    })

    isLoading.value = true
    flvPlayer.value.load()
  } catch (err) {
    isLoading.value = false
  }
}

const destroyPlayer = () => {
  if (flvPlayer.value) {
    flvPlayer.value.pause()
    flvPlayer.value.unload()
    flvPlayer.value.detachMediaElement()
    flvPlayer.value.destroy()
    flvPlayer.value = null
  }
  isLoading.value = false
}

onUnmounted(() => {
  destroyPlayer()
})

defineExpose({ destroyPlayer, createPlayer })
</script>

<style lang="scss" scoped>
.video-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: vh(700);
  overflow: hidden;
  position: relative;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4757;
  font-size: vw(16);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  padding: vw(20);
  border-radius: vw(8);
  z-index: 10;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: vw(4) solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: vw(40);
  height: vw(40);
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #fff;
  margin-top: vw(12);
  font-size: vw(16);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
