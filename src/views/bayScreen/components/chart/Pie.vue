<template>
  <div class="hbar-chart">
    <Echart :options="option" height="100%" width="100%" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Echart } from '@/components/Echart'
import { computeFontSize } from '@/utils'
let data = [
  {
    value: 180,
    name: '水质污染'
  },
  {
    value: 500,
    name: '生态破坏'
  },
  {
    value: 300,
    name: '垃圾聚集'
  },
  {
    value: 250,
    name: '其他'
  }
]
let fliterNameData = data.map((item) => {
  return {
    value: item.value,
    name: ''
  }
})
const option = ref({})
const generateOption = () => {
  option.value = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
      className: 'tooltip-box',
      formatter: function (params) {
        const htmlText = `<div class='tooltip-style'>
            <div>${params.name}</div>
            <p>数量：${params.value}</p>
            </div>`
        return htmlText
      }
    },
    title: {
      text: '{a|总数量}\n {b|1000}',
      top: '27%',
      left: 'center',
      textStyle: {
        rich: {
          a: {
            fontSize: computeFontSize(14),
            color: '#fff'
          },
          b: {
            fontSize: computeFontSize(20),
            color: '#fff',
            fontWeight: 'bold',
            padding: [computeFontSize(6), computeFontSize(8), computeFontSize(2), 0]
          }
        }
      }
    },
    legend: {
      orient: 'horizontal',
      icon: 'circle',
      itemWidth: computeFontSize(10),
      bottom: 0,
      x: 'center',
      textStyle: {
        color: '#ddd',
        fontSize: computeFontSize(14)
      }
    },
    series: [
      {
        name: '人员类型',
        type: 'pie',
        hoverAnimation: false,
        legendHoverLink: false,
        radius: ['45%', '50%'],
        center: ['50%', '40%'],
        color: ['#ffffff50'],
        labelLine: {
          normal: {
            show: false
          }
        },
        tooltip: {
          show: false
        },

        data: fliterNameData
      },
      {
        name: '超标应急响应',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '40%'],
        color: ['#2391ff', '#07e8ae', '#ffc328', '#ff745a'],
        label: {
          normal: {
            // position: 'inside',
            formatter: '{d}%',
            textStyle: {
              fontSize: computeFontSize(14),
              color: '#fff'
            }
          }
        },
        data
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
