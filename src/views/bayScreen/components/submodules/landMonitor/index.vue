<template>
  <div class="main-bay-layout">
    <div class="scroll-number-box">
      <ScrollNumber :value="scrollValue" :duration="1500" isBg class="glow" color="#ffffff" />
    </div>
    <div class="text-btn-group">
      <div class="vr-btn bay-btn" @click="handleVrPreview">AR预览</div>
    </div>
    <ARPreview ref="arPreviewRef" />
    <div class="left">
      <Left />
    </div>
    <div class="right">
      <Right />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Left from './Left.vue'
import Right from './Right.vue'
import ARPreview from '../../ARPreview.vue'
import ScrollNumber from '../../ScrollNumber.vue'
import vrt1 from '@/assets/ar/t1.jpg'
import vrt2 from '@/assets/ar/t2.jpg'
const arPreviewRef = ref(null)
const scrollValue = ref(9549557)
const handleVrPreview = () => {
  const vrConfig = {
    scenes: [
      {
        id: 'ocean-monitor-1',
        name: '监测点1',
        panorama: vrt1
      },
      {
        id: 'ocean-monitor-2',
        name: '监测点2',
        panorama: vrt2
      }
    ],
    defaultSceneId: 'ocean-monitor-1',
    showControls: true,
    autoLoad: true,
    showInfo: true
  }

  arPreviewRef.value?.open(vrConfig)
}
onMounted(() => {
  setInterval(() => {
    scrollValue.value = Math.random() * 10000000
  }, 5000)
})
</script>

<style lang="scss" scoped>
.scroll-number-box {
  position: absolute;
  z-index: 11;
  top: 4.4vh;
  right: 9vw;
}
.left,
.right {
  width: vw(450);
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.right {
  left: auto;
  right: 0;
}
.text-btn-group {
  position: absolute;
  bottom: 3.5vh;
  right: 25vw;
  z-index: 100;
  display: flex;
  gap: vw(10);
}
.main-bay-layout {
  min-height: 100vh;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100vw;
    height: 20vh;
    background: linear-gradient(to top, #000000c0 10%, transparent 100%);
    pointer-events: none;
  }
}
</style>
