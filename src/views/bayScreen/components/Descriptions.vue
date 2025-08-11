<template>
  <div class="list">
    <div class="list-page">
      <div class="item" v-for="(item) in list" :key="item.name">
        <ScrollNumber :value="item.value" :duration="1500" class="glow" color="#ffffff" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ScrollNumber from './ScrollNumber.vue'
const list = ref([
  {
    name: '陆源入海监测',
    value: 888
  },
  {
    name: '重点排口监测',
    value: 666
  },
  {
    name: '近岸海域垃圾识别',
    value: 484
  },
  {
    name: '超标指标汇总',
    value: 556
  },
  {
    name: '排口抓拍图片',
    value: 448
  },
  {
    name: '垃圾聚集点',
    value: 489
  }
])
onMounted(()=> {
  setInterval(()=> {
    list.value.forEach(item => {
      item.value = Math.floor(Math.random() * 1000)
    })
  }, 5000)
})
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: vw(20);
  .list-page {
    width: 100%;
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: vw(20);
    .item {
      width: 100%;
      text-align: center;
      p {
        margin-top: vh(10);
        font-size: vw(14);
        color: #ddd;
      }
    }
  }
}
</style>
