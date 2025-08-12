<template>
    <div class="hbar-chart">
        <Echart :options="option" height="100%" width="100%" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Echart } from '@/components/Echart'
import { computeFontSize } from '@/utils'

const option = ref({})
const generateOption = () => {
    option.value = {
        legend: {
            show: false
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '0%',
            top: '20%',
        },
        radar: {
            center: ['50%', '55%'],
            radius: '70%',
            startAngle: 90,
            splitNumber: 5,
            shape: 'polygon',
            axisName: {
                color: '#ffffff',
                fontSize: computeFontSize(14),
                textShadowColor: '#000',
                textShadowBlur: computeFontSize(8)
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(76,195,255,0.8)',
                        'rgba(76,195,255,0.6)',
                        'rgba(76,195,255,0.4)',
                        'rgba(76,195,255,0.2)',
                        'rgba(76,195,255,0.1)'
                    ].reverse()
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(0, 120, 200, 0.05)', 'rgba(0, 120, 200, 0.02)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(76,195,255,0.5)'
                }
            },
            indicator: [
                { name: '信号强度', max: 100 },
                { name: 'SNR', max: 100 },
                { name: '邻频干扰', max: 100 },
                { name: '同频干扰', max: 100 },
                { name: '时延', max: 100 }
            ]
        },
        series: [
            {
                name: '告警统计',
                type: 'radar',
                symbol: 'circle',
                symbolSize: computeFontSize(8),
                lineStyle: {
                    width: 2,
                    color: 'rgba(0, 174, 255, 1)' // 外圈线条
                },
                itemStyle: {
                    color: '#ffffff',
                    shadowColor: 'rgba(0, 234, 255, 0.8)',
                    shadowBlur: computeFontSize(10)
                },
                label: {
                    show: true,
                    color: '#ffffff',
                    fontSize: computeFontSize(14),
                    fontWeight: 'bold',
                    formatter: (params) => {
                        return params.value
                    }
                },
                areaStyle: {
                    color: 'rgba(0, 174, 255, 0.3)'
                },
                data: [
                    {
                        value: [55, 40, 70, 30, 25],
                        name: '告警统计'
                    }
                ]
            }
        ]
    }
}

onMounted(() => {
    generateOption()
    window.addEventListener('resize', generateOption)
})

onUnmounted(() => {
    window.removeEventListener('resize', generateOption)
})
</script>


<style scoped lang="scss">
.hbar-chart {
    width: 100%;
    height: 100%;
}
</style>
