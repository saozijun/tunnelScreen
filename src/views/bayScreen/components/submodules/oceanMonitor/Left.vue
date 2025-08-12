<template>
  <div class="left-container">
    <div class="card">
      <div class="card-title title-select">
        <p>隧道无线监测告警</p>
      </div>
      <div class="card-content">
        <div class="content-box">
          <el-table :data="warningData" style="width: 100%; height: 100%;" scrollbar-always-on>
            <el-table-column prop="date" label="时间" min-width="110" align="center">
              <template #default="scope">
                <div class="time-text">
                  <p>{{ dayjs(scope.row.date).format('YYYY-MM-DD') }}</p>
                  <p>{{ dayjs(scope.row.date).format('hh:mm:ss') }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="告警类型" min-width="120" align="center" />
            <el-table-column prop="level" label="告警级别" min-width="90" align="center" />
            <el-table-column prop="content" label="告警内容" min-width="160" align="center" />
            <el-table-column prop="interval" label="区间" min-width="90" align="center" />
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
import dayjs from 'dayjs';
const warningData = ref([
  {
    date: '2025-08-10 14:35:12',
    type: '信号强度',
    level: '普通告警',
    content: '南环路段检测到RSRP≤-110dBm，覆盖盲区需优化',
    interval: '南环路段'
  },
  {
    date: '2025-08-10 15:22:47',
    type: '邻频干扰',
    level: '严重告警',
    content: '北桥路段检测到ACI干扰，干扰电平≥-85dBm，需频率调整',
    interval: '北桥路段'
  },
  {
    date: '2025-08-09 18:45:30',
    type: 'SNR',
    level: '普通告警',
    content: '中央隧道下行SNR≤6dB，链路质量恶化需排查',
    interval: '中央隧道'
  },
  {
    date: '2025-08-08 23:05:50',
    type: '同频干扰',
    level: '严重告警',
    content: '东环路基站受同频干扰，C/I≤9dB导致业务中断',
    interval: '东环路'
  },
  {
    date: '2025-08-08 12:15:20',
    type: '时延',
    level: '普通告警',
    content: '西部工业区平均时延≥150ms，超出阈值需优化',
    interval: '西部工业区'
  },
  {
    date: '2025-08-07 09:30:00',
    type: '邻频干扰',
    level: '重要告警',
    content: '南桥附近邻频干扰导致BLER≥15%，需频点调整',
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

  &:hover {
    opacity: .8;
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
  height: vh(340);
  background: linear-gradient(90deg, #0984c743, #0965c733, #0965c700);

  .content-box {
    height: 100%;
    padding: vw(10);
    overflow: hidden;
  }
}

.time-text {
  text-align: center;

  p {
    font-size: vw(14);
    line-height: 1.5;
    color: #fff;
  }
}

.radar-box {
  height: vh(430);
}

.pie-container {
  height: vh(178);
}
</style>
