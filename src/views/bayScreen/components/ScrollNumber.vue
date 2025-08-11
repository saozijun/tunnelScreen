<template>
  <div class="scroll-number" :style="{ color: color }">
    <div class="number-container" ref="numberContainer">
      <span class="number-display">
        <template v-for="(char, index) in formattedChars" :key="index">
          <span v-if="isDigit(char)" :class="{'digit-bg': isBg}">{{ char }}</span>
          <span v-else class="separator">{{ char }}</span>
        </template>
      </span>
      <span v-if="suffix" class="suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'

// 定义组件属性
const props = defineProps({
  // 目标数值
  value: {
    type: Number,
    default: 0
  },
  // 动画持续时间（毫秒）
  duration: {
    type: Number,
    default: 1000
  },
  // 小数位数
  decimals: {
    type: Number,
    default: 0
  },
  // 数字后缀
  suffix: {
    type: String,
    default: ''
  },
  // 字体颜色
  color: {
    type: String,
    default: '#333'
  },
  // 是否自动开始动画
  autoStart: {
    type: Boolean,
    default: true
  },
  isBg:{
    type: Boolean,
    default: false
  },
  // 缓动函数类型
  easing: {
    type: String,
    default: 'easeInOutCubic',
    validator: (value) => ['linear', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['start', 'finish'])

// 响应式数据
const currentValue = ref(0)
const isAnimating = ref(false)
const numberContainer = ref(null)

// 使用 VueUse 的 useTransition 来创建平滑过渡
const transitionValue = useTransition(currentValue, {
  duration: props.duration,
  easing: props.easing,
  onStarted: () => {
    isAnimating.value = true
    emit('start')
  },
  onFinished: () => {
    isAnimating.value = false
    emit('finish')
  }
})

// 计算显示的数值（格式化）
const displayValue = computed(() => {
  const value = transitionValue.value
  // 确保值是有效数字
  if (isNaN(value) || value === null || value === undefined) {
    return '0'
  }

  if (props.decimals === 0) {
    return Math.floor(value).toLocaleString()
  }
  return Number(value).toFixed(props.decimals)
})

// 将显示值分解为字符数组
const formattedChars = computed(() => {
  return displayValue.value.split('')
})

// 判断字符是否为数字
const isDigit = (char) => {
  return /\d/.test(char)
}

// 开始动画的方法
const startAnimation = (targetValue = props.value) => {
  // 确保目标值是有效数字
  const validTargetValue = isNaN(targetValue) || targetValue === null || targetValue === undefined ? 0 : Number(targetValue)
  currentValue.value = validTargetValue
}

// 监听 value 属性变化
watch(() => props.value, (newValue, oldValue) => {
  if (props.autoStart && newValue !== oldValue) {
    startAnimation(newValue)
  }
}, { immediate: false })

// 重置动画
const reset = () => {
  currentValue.value = 0
}

// 暴露方法给父组件
defineExpose({
  startAnimation,
  reset,
  isAnimating: computed(() => isAnimating.value)
})

// 组件挂载时的处理
onMounted(() => {
  if (props.autoStart) {
    // 延迟一点开始动画，让组件完全渲染
    setTimeout(() => {
      startAnimation(props.value)
    }, 100)
  }
})
</script>

<style lang="scss" scoped>
.scroll-number {
  display: inline-block;
  font-weight: bold;
  line-height: 1;
  font-size: vw(32);
  .number-container {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
    overflow: hidden;

    .number-display {
      transition: all 0.1s ease;
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: center;

      .digit-bg {
        background: rgb(255 255 255 / 10%);
        border: vw(1) solid rgb(255 255 255 / 30%);
        border-radius: vw(4);
        padding: vh(10) vw(10);
        margin: 0 vw(2);
        display: inline-block;
        min-width: vw(40);
        text-align: center;
        backdrop-filter: blur(vw(4));
        // font-family: 'Agency FB';
        box-shadow: 0 vw(2) vw(6) rgba(0, 0, 0, 0.1);
      }

      .separator {
        margin: 0 vw(2);
        display: inline-block;
      }
    }

    .suffix {
      margin-left: vw(6);
      font-size: vw(14);
      opacity: 0.8;
    }
  }
}

// 发光效果
.scroll-number.glow {
  .digit-bg {
    text-shadow: 0 0 vw(15) currentColor;
  }
}
</style>