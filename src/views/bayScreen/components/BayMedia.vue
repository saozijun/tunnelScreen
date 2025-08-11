<template>
  <div class="container">
    <div class="text-md title">{{ title }}</div>
    <div class="list" :style="minHeightStyle">
       <div class="item" v-for="item in pagedList" :key="item.id" @click="handlePreview(item)">
          <img class="cover" :src="item.cover" alt="" />
          <div class="tips" v-if="type === 'video'">
            <div>
              <div>{{ item.name }}</div>
              <span>{{ item.time }}</span>
            </div>
          </div>
       </div>
    </div>
    <ul class="pagination">
      <li v-for="p in totalPages" :key="p" :class="{ active: p === page }" @click="goPage(p)"></li>
    </ul>
  </div>
  <Preview ref="previewRef"/>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Preview from './Preview.vue';
interface VideoItem {
  id: number;
  name: string;
  time: string;
  url?: string;
  cover?: string; // 可选封面图
}
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  // 视频或者图片
  type: {
    type: String,
    default: "video" 
  },
  title: {
    type: String,
    default: "实时视频监控"
  },
  // 每页显示数量
  size: {
    type: Number,
    default: 4
  },
  itemHeight: {
    type: Number,
    default: 120
  }
});
let previewRef = ref<InstanceType<typeof Preview> | null>(null);
let page = ref(1);
// 数据源改为props.list，兜底用默认值
const innerList = computed<VideoItem[]>(() => (props.list && props.list.length > 0 ? props.list as VideoItem[] : []));

const totalPages = computed(() => Math.ceil(innerList.value.length / props.size));
const pagedList = computed(() => {
  const start = (page.value - 1) * props.size;
  return innerList.value.slice(start, start + props.size);
});

const minHeightStyle = computed(() => {
  const group = Math.ceil(props.size / 2);
  const px = (props.itemHeight + 10) * group;
  const vh = (px / 1080) * 100;
  return { '--min-h': `${vh}vh`, '--item-h': `${(props.itemHeight / 1080) * 100}vh` };
});
function goPage(p: number) {
  if (p !== page.value) page.value = p;
}
function handlePreview(item: VideoItem) {
  previewRef.value?.open(item, props.type);
}
</script>
<style lang="scss" scoped>

.container{
  position: relative;
  z-index: 1;
  margin-bottom: vh(14);
  .title{
    font-size: vw(18);
  }
  .list{
    display: grid;
    min-height: var(--min-h);
    grid-template-columns: repeat(2, 1fr);
    gap: vw(14);
    margin-top: vh(16);

    .item{
      position: relative;
      height: var(--item-h);
      cursor: pointer;
      background: #262626;
      &::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: #ffffff2d;
        opacity: 0;
        transition: opacity .3s;
      }
      &:hover {
        &::after{
          opacity: 1;
        }
      }
      .cover{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .tips{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #000000a8;

        >div{
          display: flex;
          padding: vw(8) vw(10);
          font-size: vw(14);
          color: #fff;
          align-items: center;
          justify-content: space-between;

          >div{
            &::before{
              display: inline-block;
              width: vw(10);
              height: vw(10);
              margin-right: vw(10);
              background: #0dc779;
              border-radius: 50%;
              content: '';
            }
          }

          span{
            font-size: vw(14);
            color: #dadada;
          }
        }
      }
    }
  }

  .pagination{
    display: flex;
    align-items: center;
    gap: vw(10);
    margin-top: vh(14);

    li{
      width: vw(12);
      height: vw(12);
      cursor: pointer;
      background: #6d7d7f;
      transition: background 0.3s ease;

      &:hover{
        background: #0dc779;
      }

      &.active{
        background: #0dc779;
      }
    }
  }
}
</style>