<template>
    <div class="chart">
        <Echart :options="option" height="100%" width="100%" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Echart } from '@/components/Echart'
import { computeFontSize } from '@/utils'

const freqList = ref([])
const valueList = ref([])
const baseSpectrum = ref([])
const updateIntervalMs = 1000
let timerId = null

function buildFreqAxis() {
    const start = 2400
    const end = 2885
    const step = 2
    const list = []
    for (let f = start; f <= end; f += step) {
        list.push(`${f.toFixed(0)}.00 MHz`)
    }
    freqList.value = list
}

// 模拟 dBm 光谱数据（-120 ~ -20）。对常见 Wi‑Fi 信道附近做一些抬升更像实测。
function seedSpectrum() {
    valueList.value = []
    baseSpectrum.value = []
    const peaks = [2412, 2437, 2462] // 常见 1/6/11 信道中心
    for (let i = 0; i < freqList.value.length; i += 1) {
        const label = freqList.value[i]
        const mhz = Number(label.split(' ')[0])
        let base = -100 + Math.random() * 8 // 噪声地板
        peaks.forEach((p) => {
            const dist = Math.abs(mhz - p)
            if (dist <= 10) {
                base += (10 - dist) * 1.8 + Math.random() * 2
            }
        })
        const clamped = Number(Math.max(-120, Math.min(-20, base)).toFixed(2))
        baseSpectrum.value.push(clamped)
        valueList.value.push(clamped)
    }
}

// 每次 tick 以“基线 + 微小噪声”方式刷新，避免随机游走导致越来越大
function jitterAllPoints() {
    const noiseAmp = 4.2
    valueList.value = baseSpectrum.value.map((b) => {
        const noise = (Math.random() - 0.5) * 2 * noiseAmp
        const next = b + noise
        return Number(Math.max(-120, Math.min(-20, next)).toFixed(2))
    })
}

const option = ref({})
const generateOption = () => {
    option.value = {
        animation: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#00000097',
                    fontSize: computeFontSize(12),
                    show: true
                }
            },
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            className: 'tooltip-box',
            formatter: function (params) {
                const htmlText = `<div class='tooltip-style'>
                <div>${params[0].name}</div>
                    <p>功率：${params[0].value} dBm</p>
                </div>`
                return htmlText
            }
        },

        grid: { left: '8%', right: '3%', bottom: '18%', top: '10%' },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: freqList.value,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: 'rgba(255,255,255,0.35)' } },
            axisLabel: {
                color: '#d7e6ff',
                fontSize: computeFontSize(11),
                // interval: 1,
            }
        },
        yAxis: {
            type: 'value',
            min: -120,
            max: -20,
            interval: 20,
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
            axisLabel: { color: '#d7e6ff', fontSize: computeFontSize(13) }
        },
        series: [
            {
                type: 'line',
                data: valueList.value,
                showSymbol: false,
                // smooth: 0.2,
                lineStyle: { color: '#3dfc72', width: 1 },
            }
        ]
    }
}

function tick() {
    jitterAllPoints()
    generateOption() // 触发渲染
}

onMounted(() => {
    buildFreqAxis()
    seedSpectrum()
    generateOption()
    timerId = window.setInterval(tick, updateIntervalMs)
    window.addEventListener('resize', generateOption)
})

onUnmounted(() => {
    timerId && window.clearInterval(timerId)
    window.removeEventListener('resize', generateOption)
})
</script>

<style scoped lang="scss">
.chart {
    width: 100%;
    height: 100%;
}
</style>
