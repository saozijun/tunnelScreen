<template>
  <div class="left-container">
    <div class="card">
      <div class="card-title title-select">
        <p>事件预警</p>
        <div class="card-right">
          <span class="label">解决率</span>
          <div class="progress-container">
            <div class="progress-box">
              <div class="progress-bar" :style="{ width: `${resolutionRate}%` }"></div>
            </div>
            <div class="progress-text">
              <span class="percentage">{{ resolutionRate }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content" style="overflow: hidden;">
        <ScrollList
          :data="warningData"
          :enable-scroll="true"
          :scroll-speed="10"
          :pause-on-hover="true"
        />
      </div>
    </div>
    <div class="card">
      <div class="card-title">
        <p>设备数量</p>
      </div>
      <div class="card-content des-container">
        <Descriptions />
      </div>
    </div>
    <div class="card">
      <div class="card-title title-select">
        <p>海水检测</p>
        <el-select
          v-model="value"
          placeholder="全部"
          class="select-bay"
          popper-class="el_select_popper"
          :teleported="false"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="card-content">
        <GLine />
      </div>
    </div>
    <div class="billboard-box">
      <Billboard title="详细指标统计" type="success" />
    </div>
    <div class="card">
      <div class="card-title">重点监控指标</div>
      <div class="card-content">
        <MultiplePie />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Billboard from '../../Billboard.vue'
import MultiplePie from '../../chart/MultiplePie.vue'
import Descriptions from '../../Descriptions.vue'
import GLine from '../../chart/GLine.vue'
import ScrollList from '../../ScrollList.vue'

// 选择器数据
const value = ref('')
const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '溶解氧'
  }
]

// 解决率假数据 - 可以根据需要修改这个值
const resolutionRate = ref(85)

// 事件预警数据
const warningData = ref([
  {
    title: '大亚湾东山',
    subtitle: 'PH值监测异常',
    value: '12.00',
    unit: '',
    status: 'danger'
  },
  {
    title: '大亚湾东山',
    subtitle: '电导率监测预警',
    value: '90.00',
    unit: 'μS/cm',
    status: 'warning'
  },
  {
    title: '大亚湾东山',
    subtitle: '水温监测预警',
    value: '30',
    unit: '°C',
    status: 'warning'
  },
  {
    title: '大亚湾西山',
    subtitle: '溶解氧监测正常',
    value: '8.5',
    unit: 'mg/L',
    status: 'normal'
  },
  {
    title: '大亚湾南山',
    subtitle: '浊度监测正常',
    value: '15.2',
    unit: 'NTU',
    status: 'normal'
  },
  {
    title: '大亚湾北山',
    subtitle: '盐度监测正常',
    value: '35.1',
    unit: '‰',
    status: 'normal'
  }
])
</script>

<style lang="scss" scoped>

.left-container {
  width: 100%;
  height: 100%;
  padding: vw(130) 0 0 vw(20);
  font-size: vw(20);
  color: #fff;
  position: relative;
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 34vw;
    height: 100%;
    background: linear-gradient(to right, #000000c2 10%, transparent 100%);
    pointer-events: none;
  }
  .billboard-box {
    margin-bottom: vh(20);
  }
}
.card-right {
  display: flex;
  align-items: center;
  width: vw(320);
  gap: vw(12);

  .label {
    font-size: vw(13);
    color: #c9c9c9;
    white-space: nowrap;
  }

  .progress-container {
    display: flex;
    align-items: center;
    flex: 1;
    gap: vw(8);
  }

  .progress-box {
    flex: 1;
    height: vw(8);
    background: rgba(255, 255, 255, 0.2);
    border-radius: vw(4);
    overflow: hidden;
    position: relative;
    top: vw(2);
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #39f371 0%, #07ce1b 100%);
      border-radius: vw(4);
      transition: width 0.8s ease-in-out;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        );
        animation: shimmer 2s infinite;
      }
    }
  }

  .progress-text {
    .percentage {
      font-size: vw(14);
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 vw(4) rgba(0, 212, 255, 0.5);
    }
  }

  .stats-detail {
    .detail-text {
      font-size: vw(12);
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }
  }

  .loading-indicator {
    .loading-text {
      font-size: vw(12);
      color: rgba(255, 255, 255, 0.5);
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
.title-select {
  @include flex-between;
  .select-bay {
    width: vw(180);
  }
}
.card-content {
  width: 100%;
  height: vh(158);
}
.des-container{
  height: auto;
  padding: vh(16) 0;
}
</style>
