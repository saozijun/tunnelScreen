<template>
  <div class="left-container">
    <div class="card">
      <div class="card-title title-select">
        <p>车载无线监测告警列表</p>
      </div>
      <div class="card-content">
          <div class="content-box">
            <el-table :data="warningData" style="width: 100%; height: 100%;" scrollbar-always-on>
              <el-table-column prop="date" label="时间" min-width="100" align="center"/>
              <el-table-column prop="type" label="告警类型"  min-width="120" align="center"/>
              <el-table-column prop="level" label="告警级别" min-width="90" align="center"/>
              <el-table-column prop="content" label="告警内容" min-width="160" align="center" />
              <el-table-column prop="interval" label="区间" min-width="90" align="center"/>
              <el-table-column label="操作" align="center" fixed="right">
              <template #default>
                <div class="table-edit">详情</div>
              </template>
            </el-table-column>
            </el-table>
          </div>
      </div>
    </div>
        <div class="card">
      <div class="card-title title-select">
        <p>告警统计</p>
      </div>
      <div class="card-content radar-box">
        <div class="content-box">
          <Radar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Radar from "../../chart/Radar.vue";
const warningData = ref([
  {
    date: '2025-08-10 14:35:12',
    type: '弱覆盖告警',
    level: '普通告警',
    content: '区域: 南环路段 信号弱覆盖',
    interval: '南环路段'
  },
  {
    date: '2025-08-10 15:22:47',
    type: '邻频干扰',
    level: '严重告警',
    content: '区域: 北桥路段 发现邻频干扰，影响通信质量',
    interval: '北桥路段'
  },
  {
    date: '2025-08-09 21:10:05',
    type: '切换失败告警',
    level: '重要告警',
    content: '区域: 高速出口 车载终端切换失败，可能丢包',
    interval: '高速出口'
  },
  {
    date: '2025-08-09 18:45:30',
    type: '链路质量下降',
    level: '普通告警',
    content: '区域: 中央隧道链路质量下降，信噪比偏低',
    interval: '中央隧道'
  },
  {
    date: '2025-08-08 23:05:50',
    type: '基站故障',
    level: '严重告警',
    content: '区域: 东环路基站掉线，车辆通信受影响',
    interval: '东环路'
  },
  {
    date: '2025-08-08 12:15:20',
    type: '弱覆盖告警',
    level: '普通告警',
    content: '区域: 西部工业区信号覆盖较弱',
    interval: '西部工业区'
  },
  {
    date: '2025-08-07 09:30:00',
    type: '邻频干扰',
    level: '重要告警',
    content: '区域: 南桥附近频段冲突导致干扰加剧',
    interval: '南桥附近'
  }
])
</script>

<style lang="scss" scoped>
.left-container {
  width: 100%;
  height: 100%;
  padding: vw(142) 0 0 vw(20);
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
.table-edit {
  font-size: vw(14);
  color: rgb(72, 130, 255);
  cursor: pointer;
  &:hover{
    opacity: .8;
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
        background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%);
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
  height: vh(400);
  background: linear-gradient(90deg, #0984c743, #0965c733, #0965c700);
  .content-box {
    height: 100%;
    padding: vw(10);
    overflow: hidden;
  }
}
.radar-box {
  height: vh(340);
}

.pie-container {
  height: vh(178);
}
</style>
