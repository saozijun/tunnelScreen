<template>
  <div class="title-container">
    <div class="title-text">
      <p>隧道泄漏电缆无线信号监测平台</p>
    </div>
    <div class="list">
      <div>
        <button class="btn-1">在线监测</button>
        <button class="btn-1">覆盖分析</button>
      </div>
      <div>
        <button class="btn-1">干扰分析</button>
        <button class="btn-1">系统配置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref} from 'vue';
let menu = ['在线监测', '覆盖分析', '干扰分析', '系统配置'];
let menuIndex = ref(0);
let emit = defineEmits(['menu']);
</script>

<style lang="scss" scoped>
.title-container {
  width: 100%;
  height: vw(130);
  padding: vw(20) vw(20);
  font-size: vw(24);
  color: #fff;
  position: relative;
  background: url('../../../assets/screen/top-bg2.png') no-repeat;
  background-size: 100% 100%;
  .title-text{
    text-align: center;
    p {
      font-size: vw(32);
      font-weight: bold;
    }
  }
  .list{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: vw(12) vw(24);
    position: absolute;
    @include absolute-center;
    top: 75%;
    > div {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: vw(100);
      &:nth-child(1) {
        margin-left: vw(0);
      }
      &:nth-child(2) {
        margin-right: vw(0);
      }
    }
  }
}
</style>