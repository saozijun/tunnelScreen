<template>
  <div ref="containerRef" class="waveform" :style="{ background: background }">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  // 主色
  color: { type: String, default: '#00aeff' },
  // 滚动速度（相对系数，越大越快）
  speed: { type: Number, default: 1.2 },
  // 振幅系数 0-1
  amplitude: { type: Number, default: 0.9 },
  // 线宽
  lineWidth: { type: Number, default: 2 },
  // 发光强度（0 关闭）
  glow: { type: Number, default: 100 },
  // 是否显示网格
  grid: { type: Boolean, default: false },
  // 背景色
  background: { type: String, default: 'transparent' },
})

const canvasRef = ref(null)
const containerRef = ref(null)

let ctx = null
let rafId = 0
let startMs = 0

// 这些值按容器尺寸计算
let canvasWidth = 0
let canvasHeight = 0

function resizeCanvas() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const cssWidth = container.clientWidth
  const cssHeight = container.clientHeight

  canvasWidth = cssWidth
  canvasHeight = cssHeight

  canvas.width = Math.floor(cssWidth * dpr)
  canvas.height = Math.floor(cssHeight * dpr)
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${cssHeight}px`

  ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // 以 CSS px 为单位绘制
}

// ECG 合成信号（P-QRS-T），phase 为 0..1
function ecgWave(phase) {
  const twoPi = Math.PI * 3
  const p = (x) => Math.exp(-0.5 * Math.pow(x, 2))
  // 以高斯脉冲模拟各波群
  const gauss = (mu, sigma, amp) => amp * p((phase - mu) / sigma)
  let y = 0
  // P 波（小而宽）
  y += gauss(0.12, 0.035, 0.28)
  // Q 波（小而窄，向下）
  y += gauss(0.20, 0.010, -0.35)
  // R 波（尖锐主峰）
  y += gauss(0.23, 0.006, 1.25)
  // S 波（随后向下）
  y += gauss(0.26, 0.012, -0.55)
  // T 波（较宽正波）
  y += gauss(0.40, 0.050, 0.55)
  // 细小抖动（时间相关），避免完全静态
  y += 0.02 * Math.sin(twoPi * (phase * 1.0))
  return y
}

function drawFrame(nowMs) {
  if (!ctx) return
  if (!startMs) startMs = nowMs
  const t = (nowMs - startMs) / 1000 // seconds

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const centerY = canvasHeight * 0.55 // 心电图通常略偏下

  // 网格
  if (props.grid) {
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    const step = 20
    for (let x = 0; x <= canvasWidth; x += step) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, canvasHeight)
      ctx.stroke()
    }
    for (let y = 0; y <= canvasHeight; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(canvasWidth, y + 0.5)
      ctx.stroke()
    }
    ctx.restore()
  }

  // 线条样式
  ctx.strokeStyle = props.color
  ctx.lineWidth = props.lineWidth
  if (props.glow > 0) {
    ctx.shadowColor = props.color
    ctx.shadowBlur = props.glow
  } else {
    ctx.shadowBlur = 0
  }

  // 将速度换算为像素/秒
  const scrollPxPerSec = Math.max(20, props.speed * 80)
  const periodPx = Math.max(180, canvasWidth * 0.6)

  ctx.beginPath()
  const ampPx = props.amplitude * (canvasHeight * 0.35)
  for (let x = 0; x <= canvasWidth; x += 1) {
    const phase = ((x + (t * scrollPxPerSec)) % periodPx) / periodPx
    const v = ecgWave(phase)
    const y = centerY - v * ampPx
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  rafId = requestAnimationFrame(drawFrame)
}

function start() {
  cancel()
  startMs = 0
  rafId = requestAnimationFrame(drawFrame)
}

function cancel() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function handleResize() {
  resizeCanvas()
}

onMounted(async () => {
  await nextTick()
  resizeCanvas()
  start()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancel()
})

watch(
  () => [props.color, props.speed, props.amplitude, props.lineWidth, props.grid, props.glow],
  () => {
    // 属性变更时重新计算 & 重启动画
    resizeCanvas()
    start()
  }
)
</script>

<style lang="scss" scoped>
.waveform {
  position: relative;
  width: 100%;
  height: vw(160);
  overflow: hidden;
}

.waveform canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
