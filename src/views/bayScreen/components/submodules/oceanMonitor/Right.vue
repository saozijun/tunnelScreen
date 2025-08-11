<template>
  <div class="right-container">
    <div class="card">
      <div class="card-title title-select">
        <p>设备统计</p>
      </div>
      <div class="card-content">
        <div class="content-box">
          <GradientBar />
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title title-select">
        <p>车载无线监测设备</p>
        <el-checkbox v-model="deviceAll" label="全选" />
      </div>
      <div class="card-content card-content2">
        <div class="device-list">
          <div class="device-item" :class="{ 'device-item-active': item.active }" v-for="(item, index) in deviceList"
            :key="index" @click="item.active = !item.active">
            <div class="device-icon" :class="{ 'device-icon2': index % 2 !== 0 }">
              <div>
                <img src="../../../../../assets/screen/device.png" alt=""></img>
              </div>
            </div>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import GradientBar from '../../chart/GradientBar.vue'
let deviceAll = ref(false)
let deviceList = ref([
  {
    name: 'OBD',
    type: '车载诊断设备',
    active: false,
  },
  {
    name: 'LTE-Modem',
    type: '4G通信模块',
    active: false,
  },
  {
    name: 'GPS-Tracker-A',
    type: '定位追踪器',
    active: false,
  },
  {
    name: 'WiFi-Hotspot',
    type: '车载WiFi热点',
    active: false,
  },
  {
    name: 'DSRC-Unit',
    type: '车联网专用短距通信设备',
    active: false,
  },
  {
    name: 'Radar-Unit',
    type: '毫米波雷达',
    active: false,
  }
])


watch(deviceAll, (val) => {
  deviceList.value.forEach(item => {
    item.active = val
  })
})
</script>

<style lang="scss" scoped>
.right-container {
  width: 100%;
  height: 100%;
  padding: vw(142) vw(20) 0 0;
  font-size: vw(20);
  color: #fff;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
    width: 40vw;
    height: 100%;
    background: linear-gradient(to left, #000000c2 10%, transparent 100%);
    pointer-events: none;
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
    background: linear-gradient(90deg, #0965c700, #0965c733, #0984c743);

    .content-box {
      height: 100%;
      padding: vw(10);
      overflow: hidden;
    }

    .device-list {
      display: flex;
      flex-wrap: wrap;
      gap: vw(10);
      padding: vw(10);

      .device-item {
        padding: vw(10) vw(20);
        border: vw(1) solid #ffffff54;
        border-radius: vw(6);
        text-align: center;
        font-size: vw(12);
        color: #13e6e6;
        transition: box-shadow .2s ease-in-out;
        box-shadow: inset 0 0 vw(10) rgba(255, 255, 255, 0.091);
        cursor: pointer;

        &:hover {
          box-shadow: inset 0 0 vw(10) rgba(81, 241, 102, 0.589);
        }

        .device-icon {
          width: vw(40);
          height: vw(40);
          margin: 0 auto;
          position: relative;
          margin-bottom: vw(16);
          box-shadow: inset 0px vw(1) vw(10) rgb(16 130 49 / 59%);
          padding: vw(3);
          border-radius: 50%;
          filter: drop-shadow(0 0 vw(5) rgba(81, 241, 102, 0.589));

          >div {
            width: vw(34);
            height: vw(34);
            background: linear-gradient(to bottom, #1cc709, #027134);
            border-radius: 50%;
            padding: vw(7);
          }

          img {
            width: 100%;
            height: 100%;
          }
        }

        .device-icon2 {
          box-shadow: inset 0px vw(1) vw(10) rgba(212, 212, 212, 0.59) !important;
          filter: drop-shadow(0 0 vw(5) rgba(87, 87, 87, 0.589));

          >div {
            background: linear-gradient(to bottom, #e1e1e1, #6d6d6d);
          }
        }
      }

      .device-item-active {
        box-shadow: inset 0 0 vw(10) rgba(81, 241, 102, 0.589);
      }
    }

  }

  .card-content2 {
    height: vh(340);
  }
}
</style>