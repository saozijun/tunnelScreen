<template>
  <div class="scroll-list-container" :style="{ height: height }">
    <div
      class="scroll-content"
      ref="scrollContentRef"
      :class="{ 'scrolling': enableScroll && isScrolling }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 原始列表 -->
      <div class="list-wrapper">
        <div
          v-for="(item, index) in data"
          :key="`original-${index}`"
          class="list-item"
          :class="getItemClass(item)"
        >
          <div class="item-content">
            <div class="item-header">
              <div class="item-index">0{{ index + 1 }}</div>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <div class="item-subtitle">{{ item.subtitle }}</div>
            <span class="value">{{ item.value }}</span>
            <span class="item-status" :class="`status-${item.status}`">{{ getStatusText(item.status) }}</span>
          </div>
        </div>
      </div>

      <!-- 克隆列表用于无缝滚动 -->
      <div v-if="enableScroll && shouldClone" class="list-wrapper clone">
        <div
          v-for="(item, index) in data"
          :key="`original-${index}`"
          class="list-item"
          :class="getItemClass(item)"
        >
          <div class="item-content">
            <div class="item-header">
              <div class="item-index">0{{ index + 1 }}</div>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <div class="item-subtitle">{{ item.subtitle }}</div>
            <span class="value">{{ item.value }}</span>
            <span class="item-status" :class="`status-${item.status}`">{{ getStatusText(item.status) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

// 定义数据项类型
interface ListItem {
  title: string
  subtitle: string
  value: string
  unit?: string
  status: 'normal' | 'warning' | 'danger'
}

// 定义组件属性
interface Props {
  data: ListItem[]
  enableScroll?: boolean
  scrollSpeed?: number
  pauseOnHover?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableScroll: true,
  scrollSpeed: 10,
  pauseOnHover: true,
  height: 'auto'
})

// 响应式变量
const scrollContentRef = ref<HTMLElement>()
const isScrolling = ref(false)
const isPaused = ref(false)
const animationId = ref<number>()
const scrollTop = ref(0)

// 计算是否需要克隆列表
const shouldClone = computed(() => {
  return props.data.length > 0 && props.enableScroll
})

// 获取列表项样式类
const getItemClass = (item: ListItem) => {
  return {
    [`status-${item.status}`]: true
  }
}

// 鼠标悬停处理
const handleMouseEnter = () => {
  if (props.pauseOnHover) {
    isPaused.value = true
  }
}

const handleMouseLeave = () => {
  if (props.pauseOnHover) {
    isPaused.value = false
  }
}

// 滚动动画
const startScrolling = () => {
  if (!props.enableScroll || !scrollContentRef.value) return

  const scroll = () => {
    if (!isPaused.value && scrollContentRef.value) {
      scrollTop.value += props.scrollSpeed / 60 // 60fps

      const listHeight = scrollContentRef.value.querySelector('.list-wrapper')?.clientHeight || 0

      // 当滚动到一个完整列表高度时，重置到顶部实现无缝循环
      if (scrollTop.value >= listHeight) {
        scrollTop.value = 0
      }

      scrollContentRef.value.style.transform = `translateY(-${scrollTop.value}px)`
    }

    if (isScrolling.value) {
      animationId.value = requestAnimationFrame(scroll)
    }
  }

  isScrolling.value = true
  scroll()
}

const stopScrolling = () => {
  isScrolling.value = false
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
}

// 监听数据变化，重新计算滚动
watch(() => props.data, () => {
  nextTick(() => {
    if (props.enableScroll) {
      stopScrolling()
      scrollTop.value = 0
      if (scrollContentRef.value) {
        scrollContentRef.value.style.transform = 'translateY(0)'
      }
      startScrolling()
    }
  })
}, { deep: true })

// 监听滚动开关
watch(() => props.enableScroll, (newVal) => {
  if (newVal) {
    startScrolling()
  } else {
    stopScrolling()
    scrollTop.value = 0
    if (scrollContentRef.value) {
      scrollContentRef.value.style.transform = 'translateY(0)'
    }
  }
})
const getStatusText = (status: string | number) => {
  switch (status) {
    case 'danger':
      return '严重'
    case 'warning':
      return '中等'
    case 'normal':
      return '一般'
    default:
      return '未知'
  }
}
// 生命周期
onMounted(() => {
  if (props.enableScroll) {
    nextTick(() => {
      startScrolling()
    })
  }
})

onUnmounted(() => {
  stopScrolling()
})
</script>

<style lang="scss" scoped>

.scroll-list-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  width: 100%;
  transition: transform 0.1s linear;

  &.scrolling {
    transition: none;
  }
}

.list-wrapper {
  width: 100%;
}

.list-item {
  padding: vw(12) vw(16);
  border-bottom: vw(1) solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.179);
    transform: translateX(vw(4));
  }

  // 状态样式
  &.status-normal {
    .item-status {
      background: #52c41a;
      box-shadow: 0 0 vw(8) rgba(82, 196, 26, 0.5);
    }
  }

  &.status-warning {
    .item-status {
      background: #faad14;
      box-shadow: 0 0 vw(8) rgba(250, 173, 20, 0.5);
    }
  }

  &.status-danger {
    .item-status {
      background: #ff4d4f;
      box-shadow: 0 0 vw(8) rgba(255, 77, 79, 0.5);
    }
  }
}

.item-content {
  @include flex-between;
  width: 100%;
}

.item-header {
  @include flex-between;
  gap: vw(12);
  margin-bottom: vw(6);
  .item-index {
    font-size: vw(12); 
  }
}

.item-title {
  font-size: vw(14);
  color: #ffffff;
  font-weight: 500;
  flex: 1;
}

.item-status {
  font-size: vw(11);
  border-radius: vw(4);
  padding: vw(4) vw(8);
}

.item-subtitle {
  font-size: vw(12);
  color: #fff;
  line-height: 1.2;
}

.item-value {
  @include flex-between;
  align-items: baseline;
}

.value {
  font-size: vw(14);
  line-height: 1;
  color: #45de9e;
}

.unit {
  font-size: vw(12);
  color: rgba(255, 255, 255, 0.7);
  margin-left: vw(4);
}

// 滚动条样式（如果需要手动滚动时）
.scroll-list-container::-webkit-scrollbar {
  width: vw(4);
}

.scroll-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: vw(2);
}

.scroll-list-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
</style>