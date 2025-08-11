<template>
  <div class="main-bay-layout">
    <div class="left">
      <Left />
    </div>
    <div class="right">
      <Right />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Left from './Left.vue'
import Right from './Right.vue'

</script>

<style lang="scss" scoped>
.scroll-number-box{
  position: absolute;
  z-index: 11;
  top: 4.4vh;
  right: 9vw;
}
.left,
.right {
  width: vw(600);
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.right {
  left: auto;
  right: 0;
}
.text-btn-group{
  position: absolute;
  bottom: 3.5vh;
  right: 25vw;
  z-index: 100;
  display: flex;
  gap: vw(10);
}
.text-btn-group2{
  right: auto;
  left: 25vw;
}
.main-bay-layout{
  min-height: 100vh;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100vw;
    height: 20vh;
    background: linear-gradient(to top, #000000c0 10%, transparent 100%);
    pointer-events: none;
  }
}
</style>
