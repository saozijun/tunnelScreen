<template>
  <div class="chart">
    <Echart :options="option" height="100%" width="100%" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Echart } from '@/components/Echart'
import { computeFontSize } from '@/utils'
const data = [
  ['00:00', 116],
  ['01:00', 129],
  ['02:00', 135],
  ['03:00', 86],
  ['04:00', 73],
  ['05:00', 85],
  ['06:00', 73],
  ['07:00', 68],
  ['08:00', 92],
  ['09:00', 130],
  ['10:00', 245],
  ['11:00', 139],
  ['12:00', 115],
  ['13:00', 111],
  ['14:00', 309],
  ['15:00', 206],
  ['16:00', 137],
  ['17:00', 128],
  ['18:00', 85],
  ['19:00', 94],
  ['20:00', 71],
  ['21:00', 106],
  ['22:00', 84],
  ['23:00', 93],
  ['24:00', 85]
]

const dateList = data.map((item) => item[0])
const valueList = data.map((item) => item[1])

const option = ref({})
const generateOption = () => {
  option.value = {
    title: {
      text: '{a|24h平均参数} {b|0.25}',
      top: '0%',
      left: '-1%',
      textStyle: {
        rich: {
          a: {
            fontSize: computeFontSize(14),
            color: '#ddd'
          },
          b: {
            fontSize: computeFontSize(32),
            color: '#339569',
            padding: [0, 0, 2, 4]

          }
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
      className: 'tooltip-box',
      formatter: function (params) {
        const htmlText = `<div class='tooltip-style'>
            <div>${params[0].name}</div>
            <p>值：${params[0].value}</p>
            </div>`
        return htmlText
      }
    },
    grid: {
      left: '5%%',
      right: '5%',
      bottom: '20%',
      top: '20%'
    },
    visualMap: {
      show: false,
      type: 'continuous',
      min: 0,
      max: 400,
      seriesIndex: 0,
      inRange: {
        color: ['#ca4271', '#f89086']
      }
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: dateList,
      axisLabel: {
        color: '#fff',
        fontSize: computeFontSize(13),
        interval: 3,
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'line',
        data: valueList,
        showSymbol: false,
        areaStyle: {
          //区域填充样式
          normal: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#ca4271'
              },
              {
                offset: 1,
                color: '#ca427100'
              }
            ])
          }
        }
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
.chart {
  width: 100%;
  height: 100%;
}
</style>
