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
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: false
                }
            },
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            className: 'tooltip-box',
            formatter: function (params) {
                const htmlText = `<div class='tooltip-style'>
            <div>${params[0].name}</div>
            <p>数量：${params[0].value}</p>
            </div>`
                return htmlText
            }
        },
        grid: {
            left: '5%',
            top: '-5%',
            right: '8%',
            bottom: '5%',
            containLabel: true
        },

        xAxis: {
            type: 'value',
            show: false,
            position: 'top',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false
            },
        },
        yAxis: [{
            type: 'category',
            axisTick: {
                show: false,
                alignWithLabel: false,
                length: 6,
            },
            splitLine: {
                show: false
            },
            inverse: 'true',
            axisLine: {
                show: false
            },
            axisLabel: {
                fontSize: computeFontSize(14),
                color: '#fff',
            },
            data: ['轨旁ap设备', '地铁LTE_M基站', '外部Wifi设备', '2.4G其他干扰', '1.8G同频干扰', '1.8G邻频干扰']
        }

        ],
        series: [{
            name: '设备统计',
            type: 'bar',
            barWidth: computeFontSize(14),
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                    textStyle: {
                        color: 'white',
                        fontSize: computeFontSize(12)
                    }
                }
            },
            itemStyle: {
                normal: {
                    show: true,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0, // 横向渐变
                        colorStops: [
                            { offset: 0, color: '#4f9aff00' },
                            { offset: 1, color: '#4f9aff' }
                        ]
                    },
                    barBorderRadius: computeFontSize(70),
                    borderWidth: 0,
                    borderColor: '#333',
                }
            },
            barGap: '0%',
            barCategoryGap: '50%',
            data: [20, 13, 40, 34, 10, 20],
            animation: true,
            animationDuration: 800,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
                return idx * 150;
            },
            animationDurationUpdate: 800,
            animationEasingUpdate: 'cubicOut'
        }]

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
