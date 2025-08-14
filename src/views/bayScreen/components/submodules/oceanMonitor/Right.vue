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
      <div class="card-title">
        <p>2.4G全频段频谱图</p>
      </div>
      <div class="card-content card-content2">
          <DynamicLine />
      </div>
    </div>
    <div class="card">
      <div class="card-title">
        <p>1.8G全频段频谱图</p>
      </div>
      <div class="card-content card-content2">
          <DynamicLine />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GradientBar from '../../chart/GradientBar.vue'
import DynamicLine from '../../chart/DynamicLine.vue'
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
    .select-bay {
      width: vw(180);
    }
  }

  .card-content {
    width: 100%;
    height: 30vh;
    background: linear-gradient(90deg, #0984c743, #0965c733, #0965c700);

    .content-box {
      height: 100%;
      padding: vw(10);
      overflow: hidden;
    }

  }

  .card-content2 {
    height: 16.5vh;
    padding: vw(10);
  }
}
</style>