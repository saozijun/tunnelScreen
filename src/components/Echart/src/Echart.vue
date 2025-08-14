<script setup>
import { computed, onActivated, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import echarts from '@/plugins/echarts'
import { debounce } from 'lodash-es'
import 'echarts-wordcloud'

import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markArea'

defineOptions({ name: 'EChart' })

// 内部工具函数：检查是否为字符串
const isString = (value) => {
  return typeof value === 'string'
}

// 组件前缀类名
const prefixCls = 'echart'

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  width: {
    type: [Number, String],
    default: ''
  },
  height: {
    type: [Number, String],
    default: '500px'
  }
})

const theme = computed(() => {
  return 'auto'
})

const options = computed(() => {
  return Object.assign(props.options, {
    darkMode: unref(theme)
  })
})

const elRef = ref()

let echartRef = null

const contentEl = ref()

const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`

  return {
    width,
    height
  }
})

const initChart = () => {
  if (unref(elRef) && props.options) {
    echartRef = echarts.init(unref(elRef))
    echartRef?.setOption(unref(options))
  }
}

watch(
  () => options.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)

const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize()
  }
}, 100)

const contentResizeHandler = (e) => {
  const transitionEvent = e
  if (transitionEvent.propertyName === 'width') {
    resizeHandler()
  }
}

onMounted(() => {
  initChart()

  window.addEventListener('resize', resizeHandler)

  // 查找布局内容元素，用于监听宽度变化
  contentEl.value = document.getElementsByClassName('layout-content')[0] ||
                   document.getElementsByClassName('el-layout-content')[0] ||
                   document.body
  unref(contentEl) &&
    (unref(contentEl)).addEventListener('transitionend', contentResizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  unref(contentEl) &&
    (unref(contentEl)).removeEventListener('transitionend', contentResizeHandler)
})

onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
defineExpose({ resizeHandler, elRef })
</script>

<template>
  <div ref="elRef" :class="[$attrs.class, prefixCls]" :style="styles"></div>
</template>
