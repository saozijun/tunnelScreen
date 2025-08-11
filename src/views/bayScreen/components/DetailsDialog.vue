<template>
  <div>
    <el-dialog v-model="visible" width="80%" top="5vh" :show-close="false" append-to-body class="bay-dialog"
      @opened="onDialogOpened">
      <div class="bay-main">
        <div class="list">
          <ul>
            <li v-for="(item, index) in menu" :key="item" :class="{ active: menuIndex === index }"
              @click="menuIndex = index">{{ item }}</li>
          </ul>
        </div>
        <div class="content">
          <div class="left">
            <div class="left-b1"></div>
            <div class="left-b2">
              <div class="card">
                <div class="card-title">超标应急响应占比分析</div>
                <div class="card-content" v-if="showEcharts">
                  <Pie3d ref="pie3dRef1" />
                </div>
              </div>
              <div class="card">
                <div class="card-title">超标应急响应占比分析</div>
                <div class="card-content" v-if="showEcharts">
                  <Pie3d ref="pie3dRef2" />
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="list-page">
              <div class="item">
                <p>日均优良</p>
                <span>99%</span>
              </div>
              <div class="item">
                <p>本月优良</p>
                <span>99%</span>
              </div>
            </div>
            <div class="descriptions">
              <span>当前状态</span>
              <h1>一类</h1>
              <p>采集时间：2025-01-16 14时</p>
              <p>点位类别：环境浮标自动检测</p>
              <p>编码：AMSMK</p>
              <p>点位名称：大亚湾东山</p>
            </div>
            <div class="right-map">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Pie3d from './chart/Pie3d.vue'

const visible = ref(false)
const pie3dRef1 = ref()
const pie3dRef2 = ref()
const showEcharts = ref(false)

let menu = [
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一',
  '浮标一'
]
let menuIndex = ref(0)

const open = () => {
  visible.value = true
}

// 弹窗打开后的回调，确保图表正确渲染
const onDialogOpened = () => {
  nextTick(() => {
    showEcharts.value = true
    pie3dRef1.value.resizeChart()
    pie3dRef2.value.resizeChart()
  });
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.bay-main {
  min-height: 80vh;
  padding: vw(10);
  display: flex;
  flex-direction: column;
  gap: vh(20);

  .list {
    display: flex;
    align-items: center;

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: vw(20);
      list-style: none;

      li {
        min-width: vw(120);
        padding: vw(10) vw(16);
        background-color: #7a7a7a69;
        backdrop-filter: blur(vw(10));
        color: #fff;
        text-align: center;
        border-radius: vw(10);
        cursor: pointer;
        font-size: vw(14);
        transition: background-color 0.3s;

        &:hover {
          opacity: 0.9;
        }
      }

      .active {
        background-color: #146148;
      }
    }
  }

  .content {
    display: flex;
    gap: vw(20);
    flex: 1;
    height: 100%;

    .left {
      flex: 2;
      background-color: #ffffff48;
      padding: vw(20) vw(30);

      .left-b1 {
        background-color: #0000004b;
        height: vh(400);
      }

      .left-b2 {
        display: flex;
        margin-top: vh(40);
        gap: vw(20);
        color: #fff;

        >div {
          flex: 1;

          .card-content {
            margin-top: vh(20);
            width: 100%;
            height: vh(200);
          }
        }
      }
    }

    .right {
      flex: 1;
      background-color: #ffffff48;
      color: #fff;
      padding: vw(20) vw(30);

      >div {
        margin-bottom: vh(20);
      }

      .list-page {
        @include flex-between;

        .item {
          flex: 1;
          font-size: vw(30);

          p {
            font-size: vw(14);
            color: #ddd;
          }
        }
      }

      .descriptions {
        font-size: vw(16);

        >span {
          font-size: vw(14);
          color: #ddd;
        }

        h1 {
          font-weight: 500;
        }

        p {
          margin-top: vh(10);
        }
      }

      .right-map {
        width: 100%;
        height: vw(380);

        div {
          width: 100%;
          height: 100%;
          background-color: #1461286a;
        }
      }
    }
  }
}
</style>
