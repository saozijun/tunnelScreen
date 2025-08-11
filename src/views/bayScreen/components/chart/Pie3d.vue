<template>
  <div class="pie3d-chart" ref="containerRef">
    <Echart :options="option" height="100%" width="50%" ref="chartRef" />
    <ul class="list">
      <li v-for="item in 6" :key="item">
        <div>一类</div>
        <div>16个</div>
        <div>0%</div>
        <div>18个</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch, onActivated, onBeforeUnmount } from 'vue'
import { Echart } from '@/components/Echart'
// import { computeFontSize } from '@/utils'

const props = withDefaults(defineProps(), {
  disableZoom: false,
  disableRotate: false
})

// 3D饼图数据
const pieData = [
  {
    name: '检测点位',
    value: 180,
    itemStyle: {
      opacity: 0.7,
      color: '#ffffff'
    }
  },
  {
    name: '不具备检测条件',
    value: 500,
    itemStyle: {
      opacity: 0.7,
      color: '#159845'
    }
  }
]

const chartRef = ref()
const containerRef = ref()
const option = ref({})
// 饼图起始角度
const startAngle = Math.PI / 3

// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(
  startRatio,
  endRatio,
  isSelected,
  isHovered,
  k,
  height,
  startAngle = 0
) {
  // 计算（添加起始角度偏移）
  let midRatio = (startRatio + endRatio) / 2
  let startRadian = startRatio * Math.PI * 2 + startAngle
  let endRadian = endRatio * Math.PI * 2 + startAngle
  let midRadian = midRatio * Math.PI * 2 + startAngle

  // 如果只有一个扇形，则不实现选中效果
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20
    },
    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u)
      }
      return Math.sin(v) > 0 ? 1 * height : -1
    }
  }
}

// 生成模拟 3D 饼图的配置项
function getPie3D(pieData, internalDiameterRatio, startAngle = 0) {
  let series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  let legendData = []
  let k =
    typeof internalDiameterRatio !== 'undefined'
      ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
      : 1 / 3

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value

    let seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false
      },

      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k
      }
    }

    if (typeof pieData[i].itemStyle != 'undefined') {
      let itemStyle = {}
      if (typeof pieData[i].itemStyle.color != 'undefined') {
        itemStyle.color = pieData[i].itemStyle.color
      }
      if (typeof pieData[i].itemStyle.opacity != 'undefined') {
        itemStyle.opacity = pieData[i].itemStyle.opacity
      }
      seriesItem.itemStyle = itemStyle
    }
    series.push(seriesItem)
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value
    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      series[i].pieData.value / 100,
      startAngle
    )
    startValue = endValue
    legendData.push(series[i].name)
  }

  let option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
      className: 'tooltip-box',
      formatter: function (params) {
        // 通过 seriesIndex 获取对应的 pieData
        const seriesData = option.series[params.seriesIndex]
        const value = seriesData ? seriesData.pieData.value : 0
        const htmlText = `<div class='tooltip-style'>
            <div>${params.seriesName}</div>
            <p>数量：${value}</p>
            </div>`
        return htmlText
      }
    },
    legend: {
      show: false
    },
    xAxis3D: {
      min: -1.2,
      max: 1.2
    },
    yAxis3D: {
      min: -1.2,
      max: 1.2
    },
    zAxis3D: {
      min: -1.2,
      max: 1.2
    },
    grid3D: {
      show: false,
      boxHeight: 20,
      bottom: '50%',
      // environment: '#021041',
      viewControl: {
        distance: 150,
        alpha: 25,
        beta: 130,
        // 根据props控制缩放和旋转
        zoomSensitivity: props.disableZoom ? 0 : 1,
        rotateSensitivity: props.disableRotate ? 0 : 1,
        panSensitivity: props.disableRotate ? 0 : 1
      }
    },
    series: series
  }
  return option
}

// 初始化3D饼图
function initPie3D() {
  option.value = getPie3D(pieData, 0.5, startAngle)
}

// 监听props变化，重新初始化图表
function updateChartControls() {
  if (option.value && option.value.grid3D) {
    option.value.grid3D.viewControl.zoomSensitivity = props.disableZoom ? 0 : 1
    option.value.grid3D.viewControl.rotateSensitivity = props.disableRotate ? 0 : 1
    option.value.grid3D.viewControl.panSensitivity = props.disableRotate ? 0 : 1

    // 更新图表配置
    if (chartRef.value?.chart) {
      chartRef.value.chart.setOption(option.value)
    }
  }
}

// 鼠标事件处理
function bindEvents() {
  if (!chartRef.value?.chart) return

  const chart = chartRef.value.chart
  let selectedIndex = -1
  let hoveredIndex = -1

  // 监听鼠标点击事件，实现选中效果
  chart.on('click', (params) => {
    if (params.seriesIndex !== undefined) {
      // 取消之前选中的扇形
      if (selectedIndex !== -1) {
        option.value.series[selectedIndex].parametricEquation = getParametricEquation(
          option.value.series[selectedIndex].pieData.startRatio,
          option.value.series[selectedIndex].pieData.endRatio,
          false,
          hoveredIndex === selectedIndex,
          option.value.series[selectedIndex].pieStatus.k,
          option.value.series[selectedIndex].pieData.value / 100,
          startAngle
        )
        option.value.series[selectedIndex].pieStatus.selected = false
      }

      // 选中当前扇形
      if (selectedIndex !== params.seriesIndex) {
        selectedIndex = params.seriesIndex
        option.value.series[selectedIndex].parametricEquation = getParametricEquation(
          option.value.series[selectedIndex].pieData.startRatio,
          option.value.series[selectedIndex].pieData.endRatio,
          true,
          hoveredIndex === selectedIndex,
          option.value.series[selectedIndex].pieStatus.k,
          option.value.series[selectedIndex].pieData.value / 100,
          startAngle
        )
        option.value.series[selectedIndex].pieStatus.selected = true
      } else {
        selectedIndex = -1
      }

      chart.setOption(option.value)
    }
  })

  // 监听鼠标移入事件，实现高亮效果
  chart.on('mouseover', (params) => {
    if (params.seriesIndex !== undefined && hoveredIndex !== params.seriesIndex) {
      // 取消之前高亮的扇形
      if (hoveredIndex !== -1) {
        option.value.series[hoveredIndex].parametricEquation = getParametricEquation(
          option.value.series[hoveredIndex].pieData.startRatio,
          option.value.series[hoveredIndex].pieData.endRatio,
          selectedIndex === hoveredIndex,
          false,
          option.value.series[hoveredIndex].pieStatus.k,
          option.value.series[hoveredIndex].pieData.value / 100,
          startAngle
        )
        option.value.series[hoveredIndex].pieStatus.hovered = false
      }

      // 高亮当前扇形
      hoveredIndex = params.seriesIndex
      option.value.series[hoveredIndex].parametricEquation = getParametricEquation(
        option.value.series[hoveredIndex].pieData.startRatio,
        option.value.series[hoveredIndex].pieData.endRatio,
        selectedIndex === hoveredIndex,
        true,
        option.value.series[hoveredIndex].pieStatus.k,
        option.value.series[hoveredIndex].pieData.value / 100,
        startAngle
      )
      option.value.series[hoveredIndex].pieStatus.hovered = true

      chart.setOption(option.value)
    }
  })

  // 监听鼠标移出事件
  chart.on('globalout', () => {
    if (hoveredIndex !== -1) {
      option.value.series[hoveredIndex].parametricEquation = getParametricEquation(
        option.value.series[hoveredIndex].pieData.startRatio,
        option.value.series[hoveredIndex].pieData.endRatio,
        selectedIndex === hoveredIndex,
        false,
        option.value.series[hoveredIndex].pieStatus.k,
        option.value.series[hoveredIndex].pieData.value / 100,
        startAngle
      )
      option.value.series[hoveredIndex].pieStatus.hovered = false
      hoveredIndex = -1
      chart.setOption(option.value)
    }
  })
}

// 监听props变化
watch(
  () => [props.disableZoom, props.disableRotate],
  () => {
    updateChartControls()
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initPie3D()
  })
})


// 手动触发图表resize的方法
const resizeChart = () => {
   chartRef.value.resizeHandler();
}

// 暴露chart实例和resize方法给父组件
defineExpose({
  chart: computed(() => chartRef.value?.chart),
  resizeChart,
  chartRef: computed(() => chartRef.value)
})
</script>

<style scoped lang="scss">
.pie3d-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  .list {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: vw(10);
    li {
      display: flex;
      font-size: vw(14);
      gap: vw(2);
      align-items: center;
      div {
        flex: 1;
        &:nth-child(1) {
          padding-left: vw(16);
          position: relative;
          &::before {
            content: '';
            width: vw(12);
            height: vw(12);
            background: #3a7800;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: vw(-10);
          }
        }
      }
      &:nth-child(2) { 
        div:nth-child(1)::before{
          background: #b2c900;
        }
      }
      &:nth-child(3) { 
        div:nth-child(1)::before{
          background: #fdc500;
        }
      }
      &:nth-child(4) { 
        div:nth-child(1)::before{
          background: #ff9404;
        }
      }
      &:nth-child(5) { 
        div:nth-child(1)::before{
          background: #f54032;
        }
      }
      &:nth-child(6) { 
        div:nth-child(1)::before{
          background: #acaeb2;
        }
      }
    }
  }
}
</style>
