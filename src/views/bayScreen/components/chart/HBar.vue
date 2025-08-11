<template>
  <div class="hbar-chart">
    <Echart :options="option" height="100%" width="100%" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Echart } from '@/components/Echart'
import { computeFontSize } from '@/utils'
let fontColor = '#fff'
let chartData = [
  {
    name: '一级',
    value: 300
  },
  {
    name: '二级',
    value: 400
  },
  {
    name: '三级',
    value: 452
  },
  {
    name: '四级',
    value: 770
  }
]

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
      top: '5%',
      right: '5%',
      left: '10%',
      bottom: '18%'
    },
    xAxis: [
      {
        type: 'value',
        axisLine: lineOption,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: computeFontSize(12),
          color: fontColor,
          textStyle: {
            fontSize: computeFontSize(12)
          }
        },
        splitLine: lineOption
      },
      {
        axisLine: lineOption,
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: '{value}',
          color: fontColor
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        nameTextStyle: {
          color: fontColor
        },
        data: xData,
        axisLabel: {
          formatter: '{value}',
          color: fontColor,
          textStyle: {
            fontSize: computeFontSize(14)
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        type: 'bar',
        data: sData,
        barWidth: computeFontSize(10),
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(0, 0, 0, 0.5)',
          borderColor: '#31a97d',
          borderWidth: computeFontSize(2),
          borderRadius: computeFontSize(36)
        },
        itemStyle: {
          borderRadius: computeFontSize(36), // 柱体圆角
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(254, 248, 129, 1)'
            },
            {
              offset: 1,
              color: 'rgba(254, 248, 129, 1)'
            }
          ])
        },
        barGap: '-100%',
        z: 10
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
