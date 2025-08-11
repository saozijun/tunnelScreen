<template>
  <div class="right-container">
    <BayMedia :list="videoList" type="video" />
    <BayMedia :list="imgList" type="image" title="珍惜海鸟抓拍" :size="2" :itemHeight="140" />
    <div class="card">
      <div class="card-title">超标应急响应占比分析</div>
      <div class="card-content">
        <Wdj />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BayMedia from '../../BayMedia.vue'
import Wdj from '../../chart/Wdj.vue'
let videoList = ref([
  { id: 1, name: "视频1", time: "15:00:00", cover: "https://picsum.photos/300/200" },
  { id: 2, name: "视频2", time: "15:00:00", cover: "https://picsum.photos/300/200"  },
  { id: 3, name: "视频3", time: "15:00:00", cover: "https://picsum.photos/300/200"  },
  { id: 4, name: "视频4", time: "15:00:00", cover: "https://picsum.photos/300/200"  },
  { id: 5, name: "视频5", time: "15:00:00", cover: "https://picsum.photos/300/200"  }
])

let imgList = ref([
  { id: 1, name: "图片1", time: "15:00:00", cover: "https://picsum.photos/300/200", url: "https://picsum.photos/300/200" },
  { id: 2, name: "图片2", time: "15:00:00", cover: "https://picsum.photos/300/200", url: "https://picsum.photos/300/200" },
  { id: 3, name: "图片3", time: "15:00:00", cover: "https://picsum.photos/300/200", url: "https://picsum.photos/300/200" },
  { id: 4, name: "图片4", time: "15:00:00", cover: "https://picsum.photos/300/200", url: "https://picsum.photos/300/200" },
  { id: 5, name: "图片5", time: "15:00:00", cover: "https://picsum.photos/300/200", url: "https://picsum.photos/300/200" }
])
</script>

<style lang="scss" scoped>
.right-container {
  width: 100%;
  height: 100%;
  padding: vw(120) vw(20) 0 0;
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

  .card-content{
    width: 100%;
    height: vh(178);
  }
}
</style>