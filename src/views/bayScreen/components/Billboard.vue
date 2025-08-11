<template>
  <div class="billboard" :class="`text-${type}`">
    <div class="billboard-title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'success'
  },
  title: {
    type: String,
    default: '标题'
  }
})
</script>

<style lang="scss" scoped>
.billboard {
  width: 100%;
  text-align: center;
  padding: vw(13) 0;
  font-size: vw(16);
  background: linear-gradient(to right, #ec9c2d42, #59bf2645);
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: vh(-3);
    left: 0;
    width: 100%;
    height: vh(3);
    background: linear-gradient(to right, #ec9c2d, #59bf26);
  }
}
.text-warning {
  background: linear-gradient(to right, #ffc10742, #ff5e0739);
  &::after {
    background: linear-gradient(to right, #ffc107, #ff5e07);
  }
}
.text-danger {
  background: linear-gradient(to right, #f6439f42, #ff4d5044);
  &::after {
    background: linear-gradient(to right, #f6439f, #ff4d4f);
  }
}
</style>
