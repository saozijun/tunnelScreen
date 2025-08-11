<template>
  <div>
    <el-dialog
      v-model="visible"
      width="60%"
      top="10vh"
      :show-close="false"
      append-to-body
      class="bay-dialog"
    >
      <div class="flex justify-between p-box">
        <template v-if="previewType === 'video'">
          <!-- 网上公开rtmp测试地址 -->
          <!-- rtmp://liteavapp.qcloud.com/live/liteavdemoplayerstreamid -->
          <!-- rtmp://ns8.indexforce.com/home/mystream -->
          <VideoStream ref="videoStreamRef" streamUrl="http://192.168.30.209:8080/live/livestream.flv" />
        </template>
        <template v-else-if="previewType === 'image'">
          <el-image
            class="w-full h-full"
            v-if="previewItem?.url"
            :src="previewItem.url"
            :preview-src-list="[previewItem.url]"
            fit="contain"
            style="display: block; max-width: 80vw; max-height: 70vh; margin: 0 auto"
          />
          <div v-else>暂无图片资源</div>
        </template>
        <template v-else>
          <div>暂不支持的媒体类型</div>
        </template>
      </div>
      <div class="title">
        <span>采集于：2025/7/30 12: 30:00</span>
        <div @click="onClose">关闭</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VideoStream from './VideoStream.vue'
interface VideoItem {
  id: number
  name: string
  time: string
  url?: string
  cover?: string
}
const visible = ref(false)
const previewItem = ref<VideoItem | null>(null)
const previewType = ref('video')
const videoStreamRef = ref<any>()
const open = (item: VideoItem, type: string) => {
  visible.value = true
  previewItem.value = item
  previewType.value = type
  videoStreamRef.value?.createPlayer()
}
const onClose = () => {
  videoStreamRef.value?.destroyPlayer()
  visible.value = false
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.p-box{
  height: 100%;
}
.title {
  color: #fff;
  font-weight: 300;
  margin-top: vh(20);
  display: flex;
  justify-content: space-between;
  span {
    font-size: vw(16);
  }
  div {
    cursor: pointer;
    color: #fff;
    font-size: vw(16);
    &:hover {
      opacity: .8;
    }
  }
}
</style>
